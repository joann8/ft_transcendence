import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './create-chat-dto';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get()
	findAll() {
		return this.chatService.findAll();
	}
	@Post()
	createOne(@Body() createChatDto: CreateChatDto) {
		return this.chatService.createOne(createChatDto);
	}
}
