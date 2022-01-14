import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel-dto';
import { Message } from '../messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
	) {}

	async findAllofUser(user: User) {
		console.log('findAll');
		console.log(user.channels);
		if (user) {
			return user.channels;
		}
	}
	async findAll() {
		return await this.channelRepository.find({
			relations: ['users'],
		});
	}
	async findMessagesOfOne(id: number) {
		console.log('findMessagesOfOne');
		return await getRepository(Message).find({ channel: { id: id } });
	}

	async findUsersOfOne(id: number) {
		console.log('findUsersOfOne');
		const channel = await getRepository(Channel).findOne(id, {
			relations: ['users'],
		});
		return channel.users;
	}

	async findOne(id: number) {
		console.log('findOne');
		return this.channelRepository.findOne(id, {
			relations: ['users'],
		});
	}
	async createOne(createChannelDto: CreateChannelDto, user: User) {
		const newChannel = this.channelRepository.create({
			name: createChannelDto.name,
		});
		newChannel.users = [user];
		return await this.channelRepository.save(newChannel);
	}

	async removeOne(id: number) {
		console.log('removeOne');
		return this.channelRepository.delete(id);
	}

	async removeAll() {
		console.log('removeAll');

		const entities = await this.findAll();
		return this.channelRepository.delete(entities.map((elem) => elem.id));
	}
}
