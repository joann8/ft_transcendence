import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationDto } from './dto/relation.dto';
import { Relation, relation } from './entities/relation.entity';
import { UpdateRelationDto } from './dto/updateRelation.dto';
import { FindRelationDto } from './dto/findRelationdto';
import { ParseUsersClassExist } from './pipeParseUsersClassExist';
import { ParseUsersStringExist } from './pipeParseUsersStringExist';
import { ParameterStatusMessage } from 'pg-protocol/dist/messages';
import { GetRelationDto } from './dto/getRelationDto.dto';

@Controller('relation')
export class RelationController {
  constructor(private readonly relationService: RelationService) { }


  @Get('all')
  async findAll() {
    const res = await this.relationService.findAll();
    if (!res.length)
      throw new HttpException("Relation : All :  DB is empty", HttpStatus.OK)
    else
      return res
  }

  /*json payload body { 
    id_pseudo1 : "id_pseudo",
    id_pseudo2: "id_pseudo"
  }*/
  @Get(':id_pseudo1/:id_pseudo2')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param(ParseUsersStringExist) getRelationRequest: GetRelationDto): Promise<Relation> {
    // null (les users sont inconnus) ou Objet Relation
    const findRelationRequest: FindRelationDto = {
      userId1: getRelationRequest.user1.id,
      userId2: getRelationRequest.user2.id
    }
    const ret = await this.relationService.findOne(findRelationRequest);
    if (!ret)
      throw new HttpException("Relation : GetRelationStatus : No relation found", HttpStatus.NO_CONTENT)
    else {
      return ret
    }
  }

  /*json body {
    //user to update
    id_pseudo1: ""
    id_pseudo2: "",
    //relation to update 
    relation1: "",
    relation2: "",

    //en options (a supprimer ? )
    userId1 : number,
    userId2 : number
  }*/
  @Put('update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Body(ParseUsersClassExist) relationRequest: RelationDto): Promise<Relation> {

    //Create Needle
    const findRelationRequest: FindRelationDto = {
      userId1: relationRequest.userId1,
      userId2: relationRequest.userId2
    }

    //Find relation if exist with [NEEDLE]
    const relationStatus = await this.relationService.findOne(findRelationRequest)

    //If relation does not exist create it with the REQUEST parameters
    if (!relationStatus) {
      const newRelation = await this.relationService.create(relationRequest)
      throw new HttpException(`Relation : Update : New relation created : ${newRelation}`, HttpStatus.OK)
    }
    else {
      //If exist UPDATE it with the REQUEST parameters
      let updateRelationRequest = new UpdateRelationDto()
      //Update les stauts au bon endroit 
      updateRelationRequest.relation1 = (relationRequest.userId1 === relationStatus.userId1 ? relationRequest.relation1 : relationRequest.relation2)
      updateRelationRequest.relation2 = (relationRequest.userId2 === relationStatus.userId2 ? relationRequest.relation2 : relationRequest.relation1)
      updateRelationRequest.id = relationStatus.id

      await this.relationService.update(updateRelationRequest);
      const upDatedRelation = await this.relationService.findOne(findRelationRequest)
      throw new HttpException(`Relation:  Update : update sucess : ${upDatedRelation}`, HttpStatus.OK)
    }
  }

  //Si on est deja friends ou block
  @Delete('remove')
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(@Body(ParseUsersStringExist) getRelationRequest: GetRelationDto) {

    //try catch ? si remove ou findOne fail
    const relationToRemove = await this.relationService.findOne({ userId1: getRelationRequest.user1.id, userId2: getRelationRequest.user2.id })
    if (!relationToRemove)
      throw new HttpException("Relation : DeleteByPseudo : Not existing relationship", HttpStatus.NOT_FOUND)
    await this.relationService.remove(relationToRemove.id);
    throw new HttpException("Relation : DeleteByPseudo : sucess", HttpStatus.OK)
  }
  //Si on est deja friends ou block
  @Delete('remove/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async removeId(@Param('id') id: number) {
    //try catch ? si remove ou findOne fail
    try {
      await this.relationService.remove(id);
      throw new HttpException("Relation : DeleteById : sucessful", HttpStatus.OK)
    }
    catch (err) {
      throw new HttpException(`Relation : DeleteByID : Error Delete :${err}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
