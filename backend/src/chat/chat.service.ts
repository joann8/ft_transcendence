import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
<<<<<<< HEAD
import { Chat } from './chat.entity';
import { CreateChatDto } from './create-chat-dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  findAll() {
    return this.chatRepository.find();
  }

  async createOne(createChatDto: CreateChatDto) {
    const newChat = this.chatRepository.create(createChatDto);
    await this.chatRepository.save(newChat);
    return newChat;
  }
=======
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat-dto';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat)
		private chatRepository: Repository<Chat>,
	) {}

	findAll() {
		return this.chatRepository.find();
	}

	async createOne(createChatDto: CreateChatDto) {
		const newChat = await this.chatRepository.create(createChatDto);
		await this.chatRepository.save(newChat);
		return newChat;
	}
>>>>>>> master
}
