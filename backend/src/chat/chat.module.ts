import { Module } from '@nestjs/common';
import { ChannelModule } from './channel/channel.module';
import { MessagesModule } from './messages/messages.module';

@Module({
	imports: [ChannelModule, MessagesModule],
})
export class ChatModule {}
