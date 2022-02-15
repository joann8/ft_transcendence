import {
	BadRequestException,
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, In, Repository } from 'typeorm';
import { Channel, channelType } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel-dto';
import { Message } from '../messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { CheckRoles } from './decorators/channel-role.decorator';
import * as bcrypt from 'bcrypt';

import {
	channelRole,
	userChannelRole,
} from './entities/userChannelRole.entity';
import { CheckBann } from './decorators/channel-banned.decorator';
import { CreateMessageDto } from '../messages/dto/create-message-dto';
import { use } from 'passport';
import { JoinChannelDto } from './dto/join-channel-dto';
import { RelationService } from 'src/relation/relation.service';
import { Relation } from 'src/relation/entities/relation.entity';
const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';
@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
	) {}

	async hashPassword(password): Promise<string> {
		const saltRounds = 10;

		const hashedPassword = await new Promise((resolve, reject) => {
			bcrypt.hash(password, saltRounds, function (err, hash) {
				if (err) reject(err);
				resolve(hash);
			});
		});

		return hashedPassword as string;
	}

	async createOne(createChannelDto: CreateChannelDto, user: User) {
		try {
			let hash = null;
			if (createChannelDto.mode === channelType.PRIVATE) {
				hash = await this.hashPassword(createChannelDto.password);
			}
			const newChannel = await this.channelRepository.save(
				this.channelRepository.create({
					name: createChannelDto.name,
					mode: createChannelDto.mode,
					password: hash,
				}),
			);
			const newRole = getRepository(userChannelRole).create({
				user: user,
				channel: newChannel,
				role: channelRole.owner,
			});
			await getRepository(userChannelRole).save(newRole);
			return newChannel;
		} catch (err) {
			if (err && err.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
				throw new ForbiddenException('This name is already taken');
			}
			throw err;
		}
	}

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

		const test = await getRepository(Channel).save(channel);
		return newRole;
	}

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

	async findAllofMe(user: User) {
		const list = user.roles
			.map((role) =>
				role.role != channelRole.banned ? role.channel.id : null,
			)
			.filter((channel) => channel != null);
		const listRelations = await this.channelRepository.find({
			where: { id: In(list) },
			relations: ['roles', 'roles.user'],
		});
		return listRelations;
	}

	@CheckBann()
	async findUsersOfOne(channel: Channel, targetUser: User, user: User) {
		return channel.roles;
	}

	@CheckBann()
	async findMessagesOfOne(
		channel: Channel,
		targetUser: User,
		user: User,
		blockedAuthor: number[],
	) {
		let list = await getRepository(Message).find({
			where: { channel: channel },
			relations: ['channel', 'author'],
		});
		list = list.filter((elem) => !blockedAuthor.includes(elem.author.id));
		return list;
	}

	@CheckBann()
	async postMessage(
		channel: Channel,
		targetUser: User,
		user: User,
		createMesssageDto: CreateMessageDto,
	) {
		const userRole = await getRepository(userChannelRole).findOne({
			where: {
				channel: channel,
				user: user,
			},
		});
		/** IF USER NOT IN CHANNEL */
		if (!userRole) {
			return 'you are not in the channel anymore';
		}
		/** IF USER IS MUTED */
		if (userRole.role === channelRole.muted) {
			return 'you are muted';
		}
		/** IF USER IS BANNED*/
		if (userRole.role === channelRole.banned) {
			return 'you are banned';
		}
		return null;
	}

	async createDirectChannel(one: User, two: User) {
		const newChannel = await this.channelRepository.save(
			this.channelRepository.create({
				name: `${one.id_pseudo} - ${two.id_pseudo}`,
				mode: channelType.DIRECT,
				password: null,
			}),
		);
		const newRoleOne = getRepository(userChannelRole).create({
			user: one,
			channel: newChannel,
			role: channelRole.owner,
		});
		const newRoleTwo = getRepository(userChannelRole).create({
			user: two,
			channel: newChannel,
			role: channelRole.owner,
		});
		await getRepository(userChannelRole).save(newRoleOne);
		await getRepository(userChannelRole).save(newRoleTwo);
		return newChannel;
	}

	async deleteDirectChannel(one: User, two: User) {
		const directChannel = await this.channelRepository.findOne({
			where: [
				{
					name: `${one.id_pseudo} - ${two.id_pseudo}`,
				},
				{
					name: `${two.id_pseudo} - ${one.id_pseudo}`,
				},
			],
		});
		const roles = await getRepository(userChannelRole).find({
			where: {
				channel: directChannel,
			},
		});
		await getRepository(userChannelRole).remove(roles);
		await this.channelRepository.delete(directChannel);
		return directChannel;
	}

	async findOneRole(channel: Channel, user: User) {
		return await getRepository(userChannelRole).findOne({
			where: { user: user, channel: channel },
		});
	}

	async removeOneRole(id: number) {
		return getRepository(userChannelRole).delete(id);
	}

	async joinChannel(
		channel: Channel,
		user: User,
		joinChannelDto: JoinChannelDto,
	) {
		if (joinChannelDto.mode === channelType.PRIVATE) {
			if (
				(await bcrypt.compare(
					joinChannelDto.password,
					channel.password,
				)) === false
			)
				throw new ForbiddenException('Wrong Password');
		}
		/* If the user is already in the channel */
		if (channel.roles.find((elem) => elem.user.id === user.id))
			throw new ForbiddenException('User already in the channel');
		/* If there is already 5 users in the channel */
		if (channel.roles.length >= 5)
			throw new ForbiddenException(
				'There is already 5 users in the channel',
			);
		/** We save */
		const userChannelRoleRepo = getRepository(userChannelRole);

		const newRole = await userChannelRoleRepo.save(
			userChannelRoleRepo.create({
				user: user,
				channel: channel,
				role: channelRole.user,
			}),
		);
		channel.roles.push(newRole);

		const test = await getRepository(Channel).save(channel);
		return newRole;
	}

	async leaveChannel(channel: Channel, user: User) {
		const userRole = user.roles.find(
			(elem) => elem.channel.id === channel.id,
		);
		/** KICK */
		if (userRole.role !== 'banned' && userRole.role !== 'owner')
			await getRepository(userChannelRole).remove(userRole);
		return channel;
	}

	async findAll() {
		return await this.channelRepository.find({
			relations: ['roles'],
		});
	}

	async findOne(id: number) {
		return await this.channelRepository.findOne(id, {
			relations: ['roles', 'roles.user'],
		});
	}

	async removeAll() {
		const entities = await this.findAll();
		return this.channelRepository.delete(entities.map((elem) => elem.id));
	}
}
