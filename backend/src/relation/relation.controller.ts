import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, HttpException, HttpStatus, UsePipes, ValidationPipe, ConsoleLogger, Req } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationDto } from './dto/relation.dto';
import { Relation, relation } from './entities/relation.entity';
import { UpdateRelationDto } from './dto/updateRelation.dto';
import { FindRelationDto } from './dto/findRelationdto';
import { ParseUsersClassExist } from './pipeParseUsersClassExist';
import { ParseUsersStringExist } from './pipeParseUsersStringExist';
import { ParameterStatusMessage } from 'pg-protocol/dist/messages';
import { GetRelationDto } from './dto/getRelationDto.dto';
import { getRepository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { isNotEmpty } from 'class-validator';

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

  @Get('request')
  async findFriendRequest(@Req() req) /*<Promise<User[]>>*/ {
    console.log("Req.user : ", req.user)
    let requestArray = await this.relationService.findAllMyFriendRequest(req.user.id)
    console.log(requestArray)
    if (requestArray.length) {
      let tmpArray = [] // Array de : User
      for (const item of requestArray){
        console.log("loop")
        let tmpUserId = (item.relation1 === 1 ? item.userId1bis : item.userId2bis)
        let tmpUser = await getRepository(User).findOne(tmpUserId)
        tmpArray.push(tmpUser)
      }
      console.log("Tmp Array:", tmpArray)
      requestArray = tmpArray
    }
    return requestArray
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
    console.log("Relation in DB : ", relationStatus)

    //If relation does not exist create it with the REQUEST parameters
    if (!relationStatus) {
      console.log("Creating relation : ", relationRequest)
      const newRelation = await this.relationService.create(relationRequest)
      console.log("New realtion : ", newRelation)
      return newRelation
    }
    else {
      //If exist UPDATE it with the REQUEST parameters
      let updateRelationRequest = new UpdateRelationDto()
      //Update les stauts au bon endroit 

      updateRelationRequest.relation1 = (relationRequest.userId1 === relationStatus.userId1bis ? relationRequest.relation1 : relationRequest.relation2)
      updateRelationRequest.relation2 = (relationRequest.userId2 === relationStatus.userId2bis ? relationRequest.relation2 : relationRequest.relation1)
      updateRelationRequest.id = relationStatus.id

      console.log("Update Request : ", relationRequest)
      console.log("Updating DTO as : ", updateRelationRequest)

      await this.relationService.update(updateRelationRequest);
      const upDatedRelation = await this.relationService.findOne(findRelationRequest)
      return upDatedRelation
    }
  }

  //Si on est deja friends ou block
  @Delete('remove')
  @UsePipes(new ValidationPipe({ transform: true }))
  async remove(@Body(ParseUsersStringExist) getRelationRequest: GetRelationDto) {

    //try catch ? si remove ou findOne fail
    const relationToRemove = await this.relationService.findOne({ userId1: getRelationRequest.user1.id, userId2: getRelationRequest.user2.id })
    if (!relationToRemove)
      throw new HttpException("Relation : DeleteByPseudo : Not existing relationship", HttpStatus.OK)
    return await this.relationService.remove(relationToRemove.id);
  }
  //Si on est deja friends ou block
  @Delete('remove/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async removeId(@Param('id') id: number) {
    //try catch ? si remove ou findOne fail
    const ret = await this.relationService.remove(id);
    return (ret)
  }
}
