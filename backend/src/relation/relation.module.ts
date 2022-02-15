import { forwardRef, Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relation } from './entities/relation.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ChannelService } from 'src/chat/channel/channel.service';
import { ChannelModule } from 'src/chat/channel/channel.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Relation, User]),
		forwardRef(() => ChannelModule),
	],
	exports: [TypeOrmModule, RelationService, UserService],
	providers: [RelationService, UserService],
	controllers: [RelationController],
})
export class RelationModule {}
