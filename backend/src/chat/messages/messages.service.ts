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
		return this.messageRepository.find();
	}
	async findOne(id: number) {
		return this.messageRepository.findOne(id);
	}
	async createOne(createMessageDto: CreateMessageDto) {
		const newChat = this.messageRepository.create(createMessageDto);
		await this.messageRepository.save(newChat);
		return newChat;
	}
	async removeOne(id: number) {
		return this.messageRepository.delete(id);
	}

	async removeAll() {
		const entities = await this.findAll();
		return this.messageRepository.delete(
			entities.map((elem) => elem.id_message),
		);
	}
}
