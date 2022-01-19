import {
	BadRequestException,
	ForbiddenException,
	HttpException,
	Injectable,
	NotFoundException,
	Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel-dto';
import { Message } from '../messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { CheckRoles } from './decorators/channel-role.decorator';
import { AddUserDto } from './dto/add-user-dto';
import {
	channelRole,
	userChannelRole,
} from './entities/userChannelRole.entity';
import { CheckBann } from './decorators/channel-banned.decorator';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
	) {}

	/**
	 * *CREATE A CHANNEL
	 * @param createChannelDto The information about the channel we are trying to create
	 * @param user The user who try to create
	 * @returns the new channel
	 * TODO: CHECK ROLES && EXISTANCE
	 */

	async createOne(createChannelDto: CreateChannelDto, user: User) {
		const newChannel = await this.channelRepository.save(
			this.channelRepository.create({
				name: createChannelDto.name,
			}),
		);
		const newRole = getRepository(userChannelRole).create({
			user: user,
			channel: newChannel,
			role: channelRole.owner,
		});
		await getRepository(userChannelRole).save(newRole);
		return await this.channelRepository.findOne(newChannel, {
			relations: ['roles'],
		});
	}

	/**
	 * *REMOVE A CHANNEL
	 * @param id current channel
	 * @returns the removed entity
	 * TODO: CHECK ROLES && EXISTANCES
	 */

	async removeOne(id: number) {
		const channel = await this.channelRepository.findOne(id);
		const roles = await getRepository(userChannelRole).find({
			where: {
				channel: channel,
			},
		});

		await getRepository(userChannelRole).remove(roles);
		await this.channelRepository.delete(id);
		return channel;
	}
	/**
	 * *ADD A NEW USER IN A GIVEN CHANNEL
	 * @param channel The current channel we are working on
	 * @param targetUser The information about the user we are trying to add
	 * @param user The user who try to add a new user
	 * @returns The new relation created
	 * TODO: CHECK ROLES && EXISTANCES
	 */
	@CheckBann()
	async addOneUser(channel: Channel, targetUser: User, user: User) {
		/* If the user is already in the channel */
		if (channel.roles.find((elem) => elem.user.id === targetUser.id))
			throw new ForbiddenException('User already in the channel');
		/* If there is already 5 users in the channel */
		if (channel.roles.length >= 5)
			throw new ForbiddenException(
				'There is already 5 users in the channel',
			);
		/** If user who add isn't in the channel */
		if (!channel.roles.find((elem) => elem.user.id === user.id))
			throw new ForbiddenException(
				'Only users who belong to the channel can add users',
			);
		/** We save */
		const userChannelRoleRepo = getRepository(userChannelRole);

		const newRole = await userChannelRoleRepo.save(
			userChannelRoleRepo.create({
				user: targetUser,
				channel: channel,
				role: channelRole.user,
			}),
		);
		channel.roles.push(newRole);
		await this.channelRepository.save(channel);
		return newRole;
	}

	/**
	 * *KICK A USER OF A GIVEN CHANNEL
	 * @param channel The current channel we are working on
	 * @param targetUser The information about the user we are trying to add
	 * @param user The user who try to add a new user
	 * @returns The channel entity updated
	 * TODO: CHECK ROLES && EXISTANCES
	 */
	@CheckBann()
	@CheckRoles('kick')
	async kickOneUser(channel: Channel, targetUser: User, user: User) {
		const targetUserRole = targetUser.roles.find(
			(elem) => elem.channel.id === channel.id,
		);
		/** KICK */
		if (targetUserRole.role !== 'banned')
			await getRepository(userChannelRole).remove(targetUserRole);
		return channel;
	}

	/**
	 * * MUTE A USER IN A CHANNEL
	 * @param channel The current channel we are working on
	 * @param targetUser The user to mute
	 * @param user The user who mute
	 * @returns
	 */
	@CheckBann()
	@CheckRoles('muted')
	async muteOneUser(channel: Channel, targetUser: User, user: User) {
		const targetUserRole = targetUser.roles.find(
			(elem) => elem.channel.id === channel.id,
		);
		/** MUTE */
		targetUserRole.role = channelRole.muted;
		getRepository(userChannelRole).save(targetUserRole);
		return channel;
	}

	/**
	 * * ADMIN A USER IN A CHANNEL
	 * @param channel The current channel we are working on
	 * @param targetUser The user to set as admin
	 * @param user The user who want to set the user as admin
	 * @returns
	 */
	@CheckBann()
	@CheckRoles('admin')
	async adminOneUser(channel: Channel, targetUser: User, user: User) {
		const targetUserRole = targetUser.roles.find(
			(elem) => elem.channel.id === channel.id,
		);
		/** MUTE */
		targetUserRole.role = channelRole.admin;
		getRepository(userChannelRole).save(targetUserRole);
		return channel;
	}

	/**
	 * * BANN A USER OF THE CHANNEL
	 * @param channel The current channel we are working on
	 * @param targetUser The user to bann
	 * @param user The user who want to bann someone
	 * @returns
	 */
	@CheckBann()
	@CheckRoles('banned')
	async bannOneUser(channel: Channel, targetUser: User, user: User) {
		const targetUserRole = targetUser.roles.find(
			(elem) => elem.channel.id === channel.id,
		);
		/** MUTE */
		targetUserRole.role = channelRole.banned;
		getRepository(userChannelRole).save(targetUserRole);
		return channel;
	}
	/**
	 * * RESET A USER IN THE CHANNEL
	 * @param channel The current channel we are working on
	 * @param targetUser The user to reset
	 * @param user The user who want to reset someone
	 * @returns
	 */
	@CheckBann()
	@CheckRoles('user')
	async resetOneUser(channel: Channel, targetUser: User, user: User) {
		const targetUserRole = targetUser.roles.find(
			(elem) => elem.channel.id === channel.id,
		);
		/** MUTE */
		targetUserRole.role = channelRole.user;
		getRepository(userChannelRole).save(targetUserRole);
		return channel;
	}
	/**
	 * * GET THE LIST OF USER CHANNELS
	 * @param user Current user
	 * @returns list of users's channels
	 */
	async findAllofMe(user: User) {
		const list = user.roles.map((role) => role.channel);
		return list;
	}
	/**
	 * *GET ALL USERS OF A CHANNEL
	 * @returns An array of all roles of the given channel
	 * TODO: CHECK ROLES && EXISTANCE
	 */
	@CheckBann()
	async findUsersOfOne(channel: Channel, targetUser: User, user: User) {
		return channel.roles;
	}
	/**
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 */
	/**
	 * *GET ALL CHANNELS
	 * @returns An array of all the channels entities
	 * TODO: CHECK ROLES && EXISTANCE
	 */

	async findAll() {
		return await this.channelRepository.find({
			relations: ['roles'],
		});
	}

	/**
	 * *GET ALL MESSAGES OF A CHANNEL
	 * @param id The current channel
	 * @returns An array of all messages entities of the channel
	 * TODO: TODO: CHECK ROLES && EXISTANCE
	 */
	@CheckBann()
	async findMessagesOfOne(channel: Channel, targetUser: User, user: User) {
		return await getRepository(Message).find({
			where: { channel: channel },
		});
	}

	/**
	 * *GET A CHANNEL
	 * @param id Current channel
	 * @returns the channel of the given id
	 * TODO: CHECK ROLES && EXISTANCE
	 */

	async findOne(id: number) {
		return await this.channelRepository.findOne(id, {
			relations: ['roles', 'roles.user'],
		});
	}

	/**
	 * *REMOVE ALL CHANNELS
	 * @returns All the removed channels
	 * TODO: CHECK ROLES && EXISTANCES
	 */

	async removeAll() {
		const entities = await this.findAll();
		return this.channelRepository.delete(entities.map((elem) => elem.id));
	}
}
