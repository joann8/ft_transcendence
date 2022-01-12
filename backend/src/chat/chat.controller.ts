import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat-dto';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Public()
	@Get()
	findAll() {
		return this.chatService.findAll();
	}

	@Public()
	@Post()
	createOne(@Body() createChatDto: CreateChatDto) {
		console.log(createChatDto);
		return this.chatService.createOne(createChatDto);
	}

	@Public()
	@Delete()
	removeAll() {
		return this.chatService.removeAll();
	}

	@Public()
	@Delete(':id')
	removeOne(@Param('id', ParseIntPipe) id: number) {
		return this.chatService.removeOne(id);
	}
}
