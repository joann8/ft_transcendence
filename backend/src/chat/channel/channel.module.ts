import { forwardRef, Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { userChannelRole } from './entities/userChannelRole.entity';
import { MessagesModule } from '../messages/messages.module';
import { RelationModule } from 'src/relation/relation.module';
import { RelationService } from 'src/relation/relation.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel, userChannelRole]),
		MessagesModule,
		forwardRef(() => RelationModule),
	],
	exports: [TypeOrmModule, ChannelService],
	providers: [ChannelService],
	controllers: [ChannelController],
})
export class ChannelModule {}
