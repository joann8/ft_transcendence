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
import { UpdateDateColumn } from 'typeorm';
import { ChannelService } from './channel.service';
import { AddUserDto } from './dto/add-user-dto';
import { CreateChannelDto } from './dto/create-channel-dto';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	/**
	 * ? GET
	 * *http://localhost:3001/channel
	 * @returns All the channels that exist
	 */
	@Get('/')
	findAll() {
		return this.channelService.findAll();
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
	 * ?GET
	 * *http://localhost:3001/channel/{id}
	 * @param id Current channels we will working on
	 * @returns The details of the current channel
	 */

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.findOne(id);
	}

	/**
	 * ?POST
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
	 * ?PUT
	 * *http://localhost:3001/channel/{id}
	 * @param req Use the request param to get the current User
	 * @param id Current channels we will working on
	 * @param addUserDto Object received from the request with the information needed to add a user
	 */

	@Put(':id')
	addOneUser(
		@Req() req,
		@Param('id', ParseIntPipe) id: number,
		@Body() addUserDto: AddUserDto,
	) {
		return this.channelService.addOneUser(id, addUserDto, req.user);
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

	/**
	 * ?DELETE
	 * *http://localhost:3001/channel/{id}
	 * @param id Current channels we will working on
	 * @returns the entity what we have deleted
	 */

	@Delete(':id')
	removeOne(@Param('id', ParseIntPipe) id: number) {
		return this.channelService.removeOne(id);
	}
}
