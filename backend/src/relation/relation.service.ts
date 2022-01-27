import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { FindRelationDto } from './dto/findRelation.dto';
import { RelationDto } from './dto/relation.dto';
import { UpdateRelationDto } from './dto/updateRelation.dto';
import { Relation } from './entities/relation.entity';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(Relation)
    private relationsRepository: Repository<Relation>
  ) { }

  async create(createRelationDto: RelationDto): Promise<Relation> {
    /*Try  catch ? */
    const newRelation = await this.relationsRepository.create(createRelationDto)
    await this.relationsRepository.save(newRelation)
    return newRelation
  }

  //returns ALL the RELATIONSHIPS
  async findAll() {
    return this.relationsRepository.find(undefined);
  }

  async findOne(findRelationRequest: FindRelationDto): Promise<Relation> {
    const user1: User = findRelationRequest.user1
    const user2: User = findRelationRequest.user2
    return await this.relationsRepository.findOne({
      where: [
        { user1, user2 },
        { user2, user1 }
      ]
    })
  }

  async update(updateRelationRequest: Partial<Relation>): Promise<UpdateResult> {


    return await this.relationsRepository.update(
      updateRelationRequest.id, 
      {
        relation1: updateRelationRequest.relation1,
        relation2: updateRelationRequest.relation2
      }
    )
  }

  async remove(id: number) {
    return await this.relationsRepository.delete(id);
  }

}
