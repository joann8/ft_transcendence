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
}
