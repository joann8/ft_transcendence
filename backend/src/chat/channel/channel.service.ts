import {
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
import { channel } from 'diagnostics_channel';
import { AddUserDto } from './dto/add-user-dto';

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
			relations: ['users'],
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
			return user.channels;
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
			relations: ['users'],
		});
		return channel.users;
	}

	/**
	 * *GET A CHANNEL
	 * @param id Current channel
	 * @returns the channel of the given id
	 * TODO: CHECK ROLES && EXISTANCE
	 */

	async findOne(id: number) {
		return this.channelRepository.findOne(id, {
			relations: ['users'],
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
		const newChannel = this.channelRepository.create({
			name: createChannelDto.name,
		});
		newChannel.users = [user];
		return await this.channelRepository.save(newChannel);
	}

	/**
	 * *ADD A NEW USER IN A GIVEN CHANNEL
	 * @param id The current channel we are working on
	 * @param addUserDto The information about the user we are trying to add
	 * @param user The user who try to add a new user
	 * @returns The channel entity updated
	 * TODO: CHECK ROLES && EXISTANCES
	 */

	async addOneUser(id: number, addUserDto: AddUserDto, user: User) {
		const channel = await this.channelRepository.findOne(id, {
			relations: ['users'],
		});
		const newUser = await getRepository(User).findOne({
			where: { id_pseudo: addUserDto.name },
		});
		/* If the channel doesn't exist */
		if (!channel) throw new NotFoundException("The channel doesn't exist");
		/* If the new user doesn't exist */
		if (!newUser)
			throw new NotFoundException(
				"The user you are trying to add doesn't exist",
			);
		/* If the user is already in the channel */
		if (channel.users.find((elem) => elem.id_pseudo === addUserDto.name))
			throw new ForbiddenException('User already in the channel');
		/* If there is already 5 users in the channel */
		if (channel.users.length >= 5)
			throw new ForbiddenException(
				'There is already 5 users in the channel',
			);
		/** If user who add isn't in the channel */
		if (!channel.users.find((elem) => elem.id === user.id))
			throw new ForbiddenException(
				'Only users who belong to the channel can add users',
			);
		/** We save */
		channel.users = [...channel.users, newUser];
		return await this.channelRepository.save(channel);
	}

	/**
	 * *REMOVE A CHANNEL
	 * @param id current channel
	 * @returns the removed entity
	 * TODO: CHECK ROLES && EXISTANCES
	 */

	async removeOne(id: number) {
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
