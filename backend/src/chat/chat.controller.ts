import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat-dto';

@Controller('chat')
export class ChatController {
<<<<<<< HEAD
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll() {
    return this.chatService.findAll();
  }
  @Post()
  createOne(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createOne(createChatDto);
  }
=======
	constructor(private readonly chatService: ChatService) {}

	@Get()
	findAll() {
		return this.chatService.findAll();
	}
	@Post()
	createOne(@Body() createChatDto: CreateChatDto) {
		return this.chatService.createOne(createChatDto);
	}
>>>>>>> master
}
