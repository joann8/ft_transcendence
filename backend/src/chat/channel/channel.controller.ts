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
import { ChannelService } from './channel.service';
import { AddUserDto } from './dto/add-user-dto';
import { CreateChannelDto } from './dto/create-channel-dto';
import { Channel } from './entities/channel.entity';
import { ParseChannelPipe } from './pipes/parse-channel.pipe';
import { ParseUserPseudo } from './pipes/parse-user-pseudo.pipe';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

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

	@Get(':id')
	findOne(@Param('id', ParseChannelPipe) channel: Channel) {
		//return this.channelService.findOne(id);
		return channel;
	}

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
	 * *http://localhost:3001/channel/{id}/add/{targetPseudo}
	 * @param req Use the request param to get the current User
	 * @param channel Current channel
	 * @param targetUser User we are trying to add to the channel
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
	 * ?GET
	 * *http://localhost:3001/channel/user
	 * @param req Use the request param to get the current User
	 * @returns All the channels of the current user.
	 */

	@Get('/user')
	findAllofUser(@Req() req) {
		return this.channelService.findAllofUser(req.user);
	}

	/**
	 * ?GET
	 * *http://localhost:3001/channel/{id}/messages
	 * @param id Current channels we will working on
	 * @returns All the messages of the current channel
	 */

	@Get(':id/messages')
	findChannelOfOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.findMessagesOfOne(id);
	}

	/**
	 * ?GET
	 * *http://localhost:3001/channel/{id}/users
	 * @param id Current channels we will working on
	 * @returns All the users of the current channel
	 */

	@Get(':id/users')
	findUsersOfOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.findUsersOfOne(id);
	}

	/**
	 * ?DELETE
	 * *http://localhost:3001/channel/
	 * @returns All the deleted channels entities
	 */
	@Delete()
	removeAll() {
		return this.channelService.removeAll();
	}
}
