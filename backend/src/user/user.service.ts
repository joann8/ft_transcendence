import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async createEntity(user: User) {
		try {
			const newUser = await this.usersRepository.create(user);
			await this.usersRepository.save(newUser);
			return newUser;
		} catch (error) {
			throw error;
		}
	}

	async getNbUsers(): Promise<number> {
		return this.usersRepository.count();
	}

	async findAll(): Promise<User[]> {
		return this.usersRepository.find();
	}

	async findMe(id: number): Promise<User> {
		const user = await this.usersRepository.findOne(id, {
			relations: ['channels'],
		});
		if (!user) {
			throw new NotFoundException('This user does not exist1');
		}
		return user;
	}

	async findOne(id: string): Promise<User> {
		const user = await this.usersRepository.findOne(id);
		if (!user) {
			throw new NotFoundException('This user does not exist2');
		}
		return user;
	}

	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async update(id: number, user: Partial<User>): Promise<UpdateResult> {
		return this.usersRepository.update(id, user);
	}
}
