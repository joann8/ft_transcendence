import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { userChannelRole } from './entities/userChannelRole.entity';
import { MessagesModule } from '../messages/messages.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel, userChannelRole]),
		MessagesModule,
	],
	exports: [TypeOrmModule],
	providers: [ChannelService],
	controllers: [ChannelController],
})
export class ChannelModule {}
