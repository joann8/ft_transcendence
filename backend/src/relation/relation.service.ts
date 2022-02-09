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
    return this.relationsRepository.find({ relations: ["userId1", "userId2"] });
  }

  async findAllMyFriend(userId: number) {
    return this.relationsRepository.find({
      where: [
        { userId1: userId, relation1: 3, relation2: 3 },
        { userId2: userId, relation1: 3, relation2: 3 },
        { userId1: userId, relation1: 4, relation2: 5 },
        { userId2: userId, relation1: 5, relation2: 4 },

      ],
      relations: ["userId1", "userId2"]
    })
  }

  async findAllMyFriendRequest(userId: number) {
    return this.relationsRepository.find({
      where: [
        { userId1: userId, relation1: 2 },
        { userId2: userId, relation2: 2 }
      ],
      relations: ["userId1", "userId2"]
    })
  }

  async findOne(findRequest: FindRelationDto): Promise<Relation> {
    return await this.relationsRepository.findOne({
      where: [
        { userId1: findRequest.userId1, userId2: findRequest.userId2 },
        { userId1: findRequest.userId2, userId2: findRequest.userId1 },
      ],
      relations: ["userId1", "userId2"]
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
