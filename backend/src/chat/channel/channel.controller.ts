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
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel-dto';

@Controller('channel')
export class ChannelController {
	constructor(private readonly chatService: ChannelService) {}

	@Public()
	@Get('/')
	findAll() {
		return this.chatService.findAll();
	}
	@Public()
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.chatService.findOne(id);
	}
	@Public()
	@Post()
	createOne(@Body() createChannelDto: CreateChannelDto) {
		console.log(createChannelDto);
		return this.chatService.createOne(createChannelDto);
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
