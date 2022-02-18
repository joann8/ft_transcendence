import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Req,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { CreateMessageDto } from '../messages/dto/create-message-dto';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel-dto';
import { Channel } from './entities/channel.entity';
import { ParseChannelPipe } from './pipes/parse-channel.pipe';
import { ParseUserPseudo } from './pipes/parse-user-pseudo.pipe';
import { MessagesService } from '../messages/messages.service';
import { JoinChannelDto } from './dto/join-channel-dto';
import { RelationService } from 'src/relation/relation.service';
import { UpdateChannelDto } from './dto/update-channel-dto';

@Controller('channel')
export class ChannelController {
	constructor(
		private readonly channelService: ChannelService,
		private messageService: MessagesService,
		private readonly relationService: RelationService,
	) {}

	@Get('/')
	findAll() {
		return this.channelService.findAll();
	}
	@Get(':id/actualise')
	findOne(@Param('id', ParseChannelPipe) channel: Channel) {
		return channel;
	}
	@Post()
	createOne(@Req() req, @Body() createChannelDto: CreateChannelDto) {
		return this.channelService.createOne(createChannelDto, req.user);
	}

	@Delete(':id')
	removeOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.removeOne(id);
	}

	@Put(':id/add/:targetPseudo')
	addOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.addOneUser(channel, targetUser, req.user);
	}

	@Put(':id/kick/:targetPseudo')
	kickOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.kickOneUser(channel, targetUser, req.user);
	}

	@Put(':id/mute/:targetPseudo/:minutes')
	muteOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
		@Param('minutes', ParseIntPipe) minutes: number,
	) {
		return this.channelService.muteOneUser(
			channel,
			targetUser,
			req.user,
			minutes,
		);
	}

	@Put(':id/admin/:targetPseudo')
	adminOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.adminOneUser(channel, targetUser, req.user);
	}

	@Put(':id/bann/:targetPseudo')
	bannOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.bannOneUser(channel, targetUser, req.user);
	}

	@Put(':id/reset-as-user/:targetPseudo')
	resetOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.resetOneUser(channel, targetUser, req.user);
	}

	@Get('/me')
	async findAllofMe(@Req() req) {
		return this.channelService.findAllofMe(req.user);
	}

	@Get('/:id/users')
	findUsersOfOne(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
	) {
		return this.channelService.findUsersOfOne(channel, null, req.user);
	}

	@Post('/:id/messages')
	postMessage(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Body() createMesssageDto: CreateMessageDto,
	) {
		this.channelService.postMessage(
			channel,
			null,
			req.user,
			createMesssageDto,
		);
		/** WRITE MESSAGE */
		return this.messageService.createOne(
			channel,
			req.user,
			createMesssageDto,
		);
	}

	@Get(':id/messages')
	async findChannelOfOne(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
	) {
		const blockedAuthor = await this.relationService.findAllBlocked(
			req.user.id,
		);
		return this.channelService.findMessagesOfOne(
			channel,
			null,
			req.user,
			blockedAuthor,
		);
	}

	@Get(':id/role/me')
	findOneRole(@Req() req, @Param('id', ParseChannelPipe) channel: Channel) {
		return this.channelService.findOneRole(channel, req.user);
	}

	@Delete('/role/:id')
	removeOneRole(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.removeOneRole(id);
	}

	@Post('/join/:id')
	joinOne(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Body() joinChannelDto: JoinChannelDto,
	) {
		return this.channelService.joinChannel(
			channel,
			req.user,
			joinChannelDto,
		);
	}

	@Get('/leave/:id')
	leaveOne(@Req() req, @Param('id', ParseChannelPipe) channel: Channel) {
		return this.channelService.leaveChannel(channel, req.user);
	}

	@Post('/:id/update')
	updateOne(
		@Param('id', ParseChannelPipe) channel: Channel,
		@Body() updateChannelDto: UpdateChannelDto,
	) {
		return this.channelService.updateChannel(channel, updateChannelDto);
	}
}
