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

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
	) {}

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
	 * *GET ALL CHANNELS OF A USER
	 * @param user The user who try to add a new user
	 * @returns An array of all the channels entities of the user
	 * TODO: TODO: CHECK ROLES && EXISTANCE
	 */

	async findAllofUser(user: User) {
		if (user) {
			return user.roles;
		}
	}

	/**
	 * *GET ALL MESSAGES OF A CHANNEL
	 * @param id The current channel
	 * @returns An array of all messages entities of the channel
	 * TODO: TODO: CHECK ROLES && EXISTANCE
	 */

	async findMessagesOfOne(id: number) {
		return await getRepository(Message).find({ channel: { id: id } });
	}

	/**
	 * *GET ALL USERS OF A CHANNEL
	 * @param id Current channel
	 * @returns An array of all users of the given channel
	 * TODO: CHECK ROLES && EXISTANCE
	 */

	async findUsersOfOne(id: number) {
		const channel = await getRepository(Channel).findOne(id, {
			relations: ['roles'],
		});
		return channel.roles;
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
		return newChannel;
	}

	/**
	 * *ADD A NEW USER IN A GIVEN CHANNEL
	 * @param channel The current channel we are working on
	 * @param targetUser The information about the user we are trying to add
	 * @param user The user who try to add a new user
	 * @returns The channel entity updated
	 * TODO: CHECK ROLES && EXISTANCES
	 */

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
		return await this.channelRepository.save(channel);
	}

	/**
	 * *KICK A USER OF A GIVEN CHANNEL
	 * @param channel The current channel we are working on
	 * @param targetUser The information about the user we are trying to add
	 * @param user The user who try to add a new user
	 * @returns The channel entity updated
	 * TODO: CHECK ROLES && EXISTANCES
	 */
	@CheckRoles()
	async kickOneUser(channel: Channel, targetUser: User, user: User) {
		const targetUserRole = targetUser.roles.find(
			(elem) => elem.channel.id === channel.id,
		);
		/** KICK */
		await getRepository(userChannelRole).remove(targetUserRole);
		return channel;
	}

	/**
	 * *REMOVE A CHANNEL
	 * @param id current channel
	 * @returns the removed entity
	 * TODO: CHECK ROLES && EXISTANCES
	 */

	async removeOne(id: number) {
		const channel = await this.channelRepository.findOne(id);
		console.log(channel);
		const roles = await getRepository(userChannelRole).find({
			where: {
				channel: channel,
			},
		});
		await getRepository(userChannelRole).remove(roles);
		return this.channelRepository.delete(id);
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
