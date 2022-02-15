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
	UseGuards,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UpdateDateColumn } from 'typeorm';
import { CreateMessageDto } from '../messages/dto/create-message-dto';
import { ChannelService } from './channel.service';
import { AddUserDto } from './dto/add-user-dto';
import { CreateChannelDto } from './dto/create-channel-dto';
import { Channel } from './entities/channel.entity';
import { ParseChannelPipe } from './pipes/parse-channel.pipe';
import { ParseUserPseudo } from './pipes/parse-user-pseudo.pipe';
import { MessagesService } from '../messages/messages.service';
import { JoinChannelDto } from './dto/join-channel-dto';

@Controller('channel')
export class ChannelController {
	constructor(
		private readonly channelService: ChannelService,
		private messageService: MessagesService,
	) {}

	/**
	 * ! LIST ALL CHANNELS
	 * *http://localhost:3001/channel
	 * @returns All the channels that exist
	 */
	@Get('/')
	findAll() {
		return this.channelService.findAll();
	}

	/**
	 * ! RETURN CHANNEL { ID }
	 * *http://localhost:3001/channel/{id}
	 * @param channel Current channel
	 * @returns The details of the current channel
	 */

	/*@Get(':id')
	findOne(@Param('id', ParseChannelPipe) channel: Channel) {
		//return this.channelService.findOne(id);
		return channel;
	}*/

	/**
	 * ! CREATE A CHANNEL
	 * *http://localhost:3001/channel
	 * @param req Use the request param to get the current User
	 * @param createChannelDto Object received from the request with the information needed to create a Channel
	 * @returns The new channel entity what we have created
	 */

	@Post()
	createOne(@Req() req, @Body() createChannelDto: CreateChannelDto) {
		return this.channelService.createOne(createChannelDto, req.user);
	}

	/**
	 * ! DELETE A CHANNEL
	 * *http://localhost:3001/channel/{id}
	 * @param id Current channels we will working on
	 * @returns the entity what we have deleted
	 */

	@Delete(':id')
	removeOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.removeOne(id);
	}

	/**
	 * ! ADD {targetPseudo} TO CHANNEL {ID}
	 * *http://localhost:3001/channel/{id}/add/{targetPseudo}
	 * @param req Use the request param to get the current User
	 * @param channel Current channel
	 * @param targetUser User we are trying to add to the channel
	 */

	@Put(':id/add/:targetPseudo')
	addOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.addOneUser(channel, targetUser, req.user);
	}

	/**
	 * ! KICK {targetPseudo} OF CHANNEL {ID}
	 * *http://localhost:3001/channel/{id}/kick/{targetPseudo}
	 * @param req Use the request param to get the current User
	 * @param channel Current channel
	 * @param targetUser User we are trying to kick to the channel
	 * @returns the channel updated
	 */
	@Put(':id/kick/:targetPseudo')
	kickOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.kickOneUser(channel, targetUser, req.user);
	}

	/**
	 * ! MUTE {targetPseudo} OF CHANNEL {ID}
	 * *http://localhost:3001/channel/{id}/mute/{targetPseudo}
	 * @param req Use the request param to get the current User
	 * @param channel Current channel
	 * @param targetUser User we are trying to mute to the channel
	 * @returns the channel updated
	 */
	@Put(':id/mute/:targetPseudo')
	muteOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		console.log('here');
		return this.channelService.muteOneUser(channel, targetUser, req.user);
	}

	/**
	 * ! ADMIN {targetPseudo} OF CHANNEL {ID}
	 * *http://localhost:3001/channel/{id}/admin/{targetPseudo}
	 * @param req Use the request param to get the current User
	 * @param channel Current channel
	 * @param targetUser User we are trying to set as admin
	 * @returns the channel updated
	 */
	@Put(':id/admin/:targetPseudo')
	adminOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.adminOneUser(channel, targetUser, req.user);
	}

	/**
	 * ! BANN {targetPseudo} OF CHANNEL {ID}
	 * *http://localhost:3001/channel/{id}/bann/{targetPseudo}
	 * @param req Use the request param to get the current User
	 * @param channel Current channel
	 * @param targetUser User we are trying to bann
	 * @returns the channel updated
	 */
	@Put(':id/bann/:targetPseudo')
	bannOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.bannOneUser(channel, targetUser, req.user);
	}

	/**
	 * ! RESET AS USER {targetPseudo} OF CHANNEL {ID}
	 * *http://localhost:3001/channel/{id}/reset-as-user/{targetPseudo}
	 * @param req Use the request param to get the current User
	 * @param channel Current channel
	 * @param targetUser User we are trying to reset
	 * @returns the channel updated
	 */
	@Put(':id/reset-as-user/:targetPseudo')
	resetOneUser(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
		@Param('targetPseudo', ParseUserPseudo) targetUser: User,
	) {
		return this.channelService.resetOneUser(channel, targetUser, req.user);
	}

	/**
	 * ! LIST ALL CHANNELS OF CURRENT USER
	 * *http://localhost:3001/channel/me
	 * @returns All the channels that exist
	 */
	@Get('/me')
	findAllofMe(@Req() req) {
		return this.channelService.findAllofMe(req.user);
	}

	/**
	 * ! LIST ALL USERS OF A CURRENT CHANNEL
	 * *http://localhost:3001/channel/{id}/users
	 * @returns All the channels that exist
	 */
	@Get('/:id/users')
	findUsersOfOne(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
	) {
		return this.channelService.findUsersOfOne(channel, null, req.user);
	}

	/**
	 * ! POST A MESSAGE
	 * *http://localhost:3001/channel/{id}/messages
	 * @param req to get the current user
	 * @param channel current channel
	 * @param createMesssageDto body of request for create a message
	 * @returns the new message entity
	 */
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

	/**
	 * ! LIST ALL MESSAGES OF A CURRENT CHANNEL
	 * *http://localhost:3001/channel/{id}/messages
	 * @param req use to get current user
	 * @param channel current channel
	 * @returns messages list of the channel
	 */

	@Get(':id/messages')
	findChannelOfOne(
		@Req() req,
		@Param('id', ParseChannelPipe) channel: Channel,
	) {
		return this.channelService.findMessagesOfOne(channel, null, req.user);
	}

	/**
	 * ! GET A ROLE
	 * *http://localhost:3001/channel/role/{id}
	 * @param id Current channels we will working on
	 * @returns the entity what we have deleted
	 */

	@Get(':id/role/me')
	findOneRole(@Req() req, @Param('id', ParseChannelPipe) channel: Channel) {
		return this.channelService.findOneRole(channel, req.user);
	}
	/**
	 * ! DELETE A ROLE
	 * *http://localhost:3001/channel/role/{id}
	 * @param id Current channels we will working on
	 * @returns the entity what we have deleted
	 */

	@Delete('/role/:id')
	removeOneRole(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.removeOneRole(id);
	}
	/**
	 * ! JOIN A CHANNEL
	 * *http://localhost:3001/channel/role/{id}
	 * @param id Current channels we will working on
	 * @returns the entity what we have deleted
	 */

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
}
