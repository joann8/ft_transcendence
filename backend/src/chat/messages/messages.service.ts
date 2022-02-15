import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { getRepository, Repository } from 'typeorm';
import { Channel } from '../channel/entities/channel.entity';
import { CreateMessageDto } from './dto/create-message-dto';
import { Message } from './entities/message.entity';
@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
	) {}

	async createOne(
		channel: Channel,
		user: User,
		createMessageDto: CreateMessageDto,
	) {
		console.log('here');
		const newMessage = this.messageRepository.create({
			author: user,
			channel: channel,
			content: createMessageDto.content,
		});
		await this.messageRepository.save(newMessage);
		return newMessage;
	}
}
