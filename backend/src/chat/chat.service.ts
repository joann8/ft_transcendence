import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat-dto';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat)
		private chatRepository: Repository<Chat>,
	) {}

	async findAll() {
		return this.chatRepository.find();
	}

	async createOne(createChatDto: CreateChatDto) {
		const newChat = this.chatRepository.create(createChatDto);
		await this.chatRepository.save(newChat);
		return newChat;
	}

	async removeOne(id: number) {
		return this.chatRepository.delete(id);
	}

	async removeAll() {
		return this.chatRepository.delete();
	}
}
