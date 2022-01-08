import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	HttpException,
	Req,
	Put,
	UseGuards,
	Patch,
	Redirect,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateCurrentUserDto } from './dto/updateCurrentUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
<<<<<<< HEAD
  constructor(private readonly userService: UserService) {}
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createEntity(createUserDto);
  }

    @Get()
    getAll() {
        return this.userService.findAll();
    }

    @Get(':id_pseudo') // SEARCH BY PSEUDO INSTEAD OF PK
    getOne(@Param() userId : string) {
        return this.userService.findOne(userId);
    }

    @Delete(':id_pseudo') // SAME
    removeOne(@Param() userId : string ) {
        return this.userService.remove(userId);
    }
  }
=======
	constructor(private readonly userService: UserService) {}

	// CREATE AN USER (Admin only)
	@Post()
	@UseGuards(AdminGuard)
	async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.userService.createEntity(createUserDto);
	}
	// UPDATE AN USER (Admin only)
	@Put()
	@UseGuards(AdminGuard)
	async updateUSer(@Body() updateUserDto: UpdateUserDto): Promise<User> {
		await this.userService.update(updateUserDto);
		return this.userService.findOne(updateUserDto.id.toString());
	}
	// DELETE AN USER (Admin only)
	@Delete(':id_pseudo')
	@UseGuards(AdminGuard)
	async removeUser(@Param() userId: string): Promise<void> {
		this.userService.remove(userId);
	}
	// SEARCH AN USER
	@Get(':id_pseudo')
	async getUser(@Param() userId: string): Promise<User> {
		const user = await this.userService.findOne(userId);
		if (!user) {
			throw new HttpException('This user does not exist', 404);
		}
		return user;
	}
	// GET MY PROFILE
	@Get()
	async getCurrentUser(@Req() req): Promise<User> {
		return req.user;
	}
	// UPDATE MY PROFILE (Look at UpdateCurrentUserDto for available options)
	@Patch()
	async updateCurrentUser(
		@Req() req,
		@Body() updateCurrentUserDto: UpdateCurrentUserDto,
	): Promise<User> {
		Object.assign(req.user, updateCurrentUserDto);
		await this.userService.update(req.user);
		return this.userService.findOne(req.user.id.toString());
	}
	// DELETE MY PROFILE
	@Delete()
	@Redirect('/')
	async deleteCurrentUser(@Req() req): Promise<void> {
		this.userService.remove(req.user.id);
	}
}
>>>>>>> master
