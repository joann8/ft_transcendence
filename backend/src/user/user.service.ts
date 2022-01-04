import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async createEntity(createUserDto: CreateUserDto) {
		try {
			const newUser = await this.usersRepository.create(createUserDto);
			await this.usersRepository.save(newUser);
			return newUser;
		} catch (error) {
			throw error;
		}
	}

	//Gerer les erreur si data pas dans la DB
	//findAll(): Promise<User[]> {
	async findAll() {
		return this.usersRepository.find();
	}

	async findOne(id: string) {
		return this.usersRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}
}
