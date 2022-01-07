import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
<<<<<<< HEAD
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //Gerer le filtrage des donnes pour le DTO
  async createEntity(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.create(createUserDto);
      await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      console.log(error);
      if (error.code === '23505')
        throw new ConflictException('login already exist');
    }
  }
=======
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
>>>>>>> master

	//Gerer les erreur si data pas dans la DB
	//findAll(): Promise<User[]> {
	async findAll(): Promise<User[]> {
		return this.usersRepository.find();
	}

<<<<<<< HEAD
  async findOne(id: string) {
    const ret = await this.usersRepository.findOne(id);
    if (!ret) throw new HttpException('This user does not exist', 404);
    return ret;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
=======
	async findOne(id: string): Promise<User> {
		return this.usersRepository.findOne(id);
	}

	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}
>>>>>>> master
}
