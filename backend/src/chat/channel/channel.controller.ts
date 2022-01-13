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
	constructor(private readonly channelService: ChannelService) {}

	@Public()
	@Get('/')
	findAll() {
		return this.channelService.findAll();
	}
	@Public()
	@Get(':id/messages')
	findChannelOfOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.findMessagesOfOne(id);
	}
	@Public()
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.findOne(id);
	}
	@Public()
	@Post()
	createOne(@Body() createChannelDto: CreateChannelDto) {
		console.log(createChannelDto);
		return this.channelService.createOne(createChannelDto);
	}

	@Public()
	@Delete()
	removeAll() {
		return this.channelService.removeAll();
	}

	@Public()
	@Delete(':id')
	removeOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.removeOne(id);
	}
}
