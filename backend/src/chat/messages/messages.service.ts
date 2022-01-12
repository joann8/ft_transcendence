import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message-dto';
import { Message } from './entities/message.entity';
@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
	) {}

	async findAll() {
		return 'ceci est la liste de tout les messages';
		//return this.messageRepository.find();
	}

	async createOne(createMessageDto: CreateMessageDto) {
		const newChat = this.messageRepository.create(createMessageDto);
		await this.messageRepository.save(newChat);
		return newChat;
	}
}
