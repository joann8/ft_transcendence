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
import { CreateMessageDto } from './dto/create-message-dto';

import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Public()
	@Get()
	findAll() {
		return this.messagesService.findAll();
	}
	@Public()
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.messagesService.findOne(id);
	}
	@Public()
	@Post()
	createOne(@Body() createMessageDto: CreateMessageDto) {
		return this.messagesService.createOne(createMessageDto);
	}

	@Public()
	@Delete()
	removeAll() {
		return this.messagesService.removeAll();
	}

	@Public()
	@Delete(':id')
	removeOne(@Param('id', ParseIntPipe) id: number) {
		return this.messagesService.removeOne(id);
	}
}
