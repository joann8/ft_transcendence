import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationDto } from './dto/relation.dto';
import { FindRelationDto } from './dto/findRelation.dto';
import { Relation, relation } from './entities/relation.entity';
import { NoNeedToReleaseEntityManagerError } from 'typeorm';
import { PipeParseUsersExist } from './pipeParseUsersExist';
import { UpdateRelationDto } from './dto/updateRelation.dto';

@Controller('relation')
export class RelationController {
  constructor(private readonly relationService: RelationService) { }


  @Get('all')
  findAll() {
    return this.relationService.findAll();
  }

  @Get()
  //Pipe (Body()) ==> findRelation
  async findOne(@Body() findRelationRequest: FindRelationDto): Promise<Relation> {
    // null (les users sont inconnus) ou Objet Relation
    return await this.relationService.findOne(findRelationRequest);
  }

  @Patch('update')
  async update(@Body(PipeParseUsersExist) relationRequest: RelationDto): Promise<Relation> {

    //Create Needle
    const findRelationRequest: FindRelationDto = {
      user1: relationRequest.user2,
      user2: relationRequest.user2
    }

    //Find relation if exist with [NEEDLE]
    const relationStatus = await this.relationService.findOne(findRelationRequest)

    //If relation does not exist create it with the REQUEST parameters
    if (!relationStatus)
      return await this.relationService.create(relationRequest)
    else {
      //If exist UPDATE it with the REQUEST parameters
      const updateRelationRequest: UpdateRelationDto = {
        id : relationStatus.id,
        relation1 : relationRequest.relation1,
        relation2 : relationRequest.relation2
      }
      await this.relationService.update(updateRelationRequest);
      return await this.relationService.findOne(findRelationRequest)
    }
  }


  //Si on est deja friends ou block
  @Delete('remove')
  async remove(@Body(PipeParseUsersExist) relationRequest: RelationDto) {

    //try catch ? si remove ou findOne fail
    const relationToRemove = await this.relationService.findOne({user1: relationRequest.user1, user2:relationRequest.user2})
    return await this.relationService.remove(relationToRemove.id);
  }
}
