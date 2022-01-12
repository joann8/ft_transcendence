import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { MessagesModule } from './messages/messages.module';

@Module({
	imports: [TypeOrmModule.forFeature([Chat]), MessagesModule],
	exports: [TypeOrmModule],
	providers: [ChatService],
	controllers: [ChatController],
})
export class ChatModule {}
