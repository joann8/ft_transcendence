import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { FindRelationDto } from './dto/findRelationdto';
import { RelationDto } from './dto/relation.dto';
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

  async findOne(findRequest: FindRelationDto): Promise<Relation> {
  /*  const id_pseudo1: string = findRelationRequest.id_pseudo1
    const id_pseudo2: string = findRelationRequest.id_pseudo2
    console.log("dto before findOne: ", findRelationRequest)
    */
   //Appeler find ?
    return await this.relationsRepository.findOne({
      where: [
        { userId1: findRequest.userId1  }, {userId2 : findRequest.userId2},
        { userId1: findRequest.userId2  }, {userId2 : findRequest.userId1},
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
