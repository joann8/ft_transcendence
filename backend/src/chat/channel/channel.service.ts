import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel-dto';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
	) {}

	async findAll() {
		return this.channelRepository.find();
	}
	async findOne(id: number) {
		return this.channelRepository.findOne(id);
	}
	async createOne(createChannelDto: CreateChannelDto) {
		const newChannel = this.channelRepository.create(createChannelDto);
		await this.channelRepository.save(newChannel);
		return newChannel;
	}

	async removeOne(id: number) {
		return this.channelRepository.delete(id);
	}

	async removeAll() {
		const entities = await this.findAll();
		return this.channelRepository.delete(
			entities.map((elem) => elem.id_channel),
		);
	}
}
