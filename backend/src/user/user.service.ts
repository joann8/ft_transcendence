import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userChannelRole } from 'src/chat/channel/entities/userChannelRole.entity';
import { getRepository, Repository, UpdateResult } from 'typeorm';
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
			const newUser = this.usersRepository.create(user);
			await this.usersRepository.save(newUser);
			return newUser;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async getNbUsers(): Promise<number> {
		return await this.usersRepository.count();
	}

	async findAll(): Promise<User[]> {
		return await this.usersRepository.find();
	}

	async findMe(id: number): Promise<User> {
		const user = await this.usersRepository.findOne(id, {
			relations: ['roles'],
		});
		if (!user) {
			throw new NotFoundException('This user does not exist1');
		}
		return user;
	}

	async createOne(createUserDto: CreateUserDto): Promise<User> {
		return await this.usersRepository.save(
			this.usersRepository.create(createUserDto),
		);
	}
	async findOne(user_pseudo: string): Promise<User> {
		// correction ?
		// 		return await this.usersRepository.findOne({id_pseudo : user_pseudo});
		return await this.usersRepository.findOne(user_pseudo, {
			relations: ['roles', 'roles.channel'],
		});
	}

	/*async findOne(id: number): Promise<User> {
		return await this.usersRepository.findOne(id, {
			relations: ['roles', 'roles.channel'],
		});
	}*/
	async deleteOne(id: number): Promise<User> {
		const user = await this.usersRepository.findOne(id, {
			relations: ['roles'],
		});
		await getRepository(userChannelRole).remove(user.roles);
		return await this.usersRepository.remove(user);
	}
	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async update(id: number, user: Partial<User>): Promise<UpdateResult> {
		return await this.usersRepository.update(id, user);
	}

	async winElo(winner: User): Promise<UpdateResult> {
		const user = await this.usersRepository.findOne(winner.id);
		user.elo += 100;
		return await this.usersRepository.update(user.id, user);
	}

	async getLeaderboard(): Promise<User[]> {
		const leaders = await this.usersRepository.find({
			order: { elo: 'DESC' },
			take: 2, //a modifier, combien de données veut-on dans le tableau lead?
		});
		return leaders;
	}
}
