<<<<<<< HEAD
import { Injectable, NotFoundException, Req } from '@nestjs/common';
=======
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
>>>>>>> origin/adrien
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

<<<<<<< HEAD
	async findMe(@Req() req): Promise<User> {
		return await this.usersRepository.findOne(req.user);
	}

	async findOne(id: string): Promise<User> {
		return await this.usersRepository.findOne(id);
=======
	/*async findById(userId : number) : Promise<User> {
		return await this.usersRepository.findOne(userId)
	}
	*/
	
	async findOne(user_pseudo: string): Promise<User> {

		// correction ? 
		// 		return await this.usersRepository.findOne({id_pseudo : user_pseudo});
		return await this.usersRepository.findOne(user_pseudo);
>>>>>>> origin/adrien
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

	async winElo(winner : User): Promise<UpdateResult> {
		const user = await this.usersRepository.findOne(winner.id)
		user.elo += 100;
		return await this.usersRepository.update(user.id, user);
	}

	async getLeaderboard() : Promise<User[]>
	{
		const leaders = await this.usersRepository.find( {
			order: { elo : "DESC" }, 
			take : 2 //a modifier, combien de données veut-on dans le tableau lead?
		});
		return leaders;
	}
}
