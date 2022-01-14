import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Req,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel-dto';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Get('/')
	findAll() {
		return this.channelService.findAll();
	}

	@Get('/user')
	findAllofUser(@Req() req) {
		return this.channelService.findAllofUser(req.user);
	}

	@Get(':id/messages')
	findChannelOfOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.findMessagesOfOne(id);
	}
	@Get(':id/users')
	findUsersOfOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.findUsersOfOne(id);
	}
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.findOne(id);
	}

	@Post()
	createOne(@Req() req, @Body() createChannelDto: CreateChannelDto) {
		console.log(req.user);
		return this.channelService.createOne(createChannelDto, req.user);
	}

	@Delete()
	removeAll() {
		return this.channelService.removeAll();
	}

	@Delete(':id')
	removeOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.removeOne(id);
	}
}
