import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chat/chat.entity';
import { Relation } from './entities/relation.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Relation, User])],
	exports: [TypeOrmModule, RelationService, UserService],
  providers: [RelationService, UserService],
  controllers: [RelationController]

})
export class RelationModule {}
