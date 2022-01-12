import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateMessageDto } from './dto/create-message-dto';

import { MessagesService } from './messages.service';

@Controller('chat/messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Public()
	@Get()
	findAll() {
		return this.messagesService.findAll();
	}
	@Post()
	createOne(@Body() createMessageDto: CreateMessageDto) {
		return this.messagesService.createOne(createMessageDto);
	}
}
