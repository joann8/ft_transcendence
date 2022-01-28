import { Module } from '@nestjs/common';
import { ChannelGateway } from './channel.gateway';
import { ChannelModule } from './channel/channel.module';
import { ChannelService } from './channel/channel.service';
import { MessagesModule } from './messages/messages.module';
import { MessagesService } from './messages/messages.service';

@Module({
	imports: [ChannelModule, MessagesModule],
	exports: [ChannelModule, MessagesModule],
	providers: [ChannelGateway, ChannelService, MessagesService],
})
export class ChatModule {}
