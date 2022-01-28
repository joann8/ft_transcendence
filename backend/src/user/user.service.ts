import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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
		return await this.usersRepository.count();
	}

	async findAll(): Promise<User[]> {
		return await this.usersRepository.find();
	}

	async findByPseudo(user_pseudo: string) : Promise<User> {
		return await this.usersRepository.findOne({id_pseudo : user_pseudo})
	}
	
	async findOne(user_pseudo: string): Promise<User> {

		// correction ? 
		// 		return await this.usersRepository.findOne({id_pseudo : user_pseudo});
		return await this.usersRepository.findOne(user_pseudo);
	}

	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async update(id: number, user: Partial<User>): Promise<UpdateResult> {
			const updatedUser = await this.usersRepository.update(id, user)
			.catch(err => {
				throw err
			});
			return updatedUser
	}
}
