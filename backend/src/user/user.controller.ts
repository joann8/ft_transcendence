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
	UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { status, User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Post()
	async createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.createEntity(createUserDto);
	}

	@Get()
	async getCurrentUser(@Req() req): Promise<User> {
		return req.user;
	}

	@Put()
	async updateCurrentUser(
		@Req() req,
		@Body() user: UpdateUserDto,
	): Promise<User> {
		if (req.user.id != user.id) {
			throw new UnauthorizedException("Please don't touch this user");
		}
		req.user = user;
		await this.userService.update(req.user);
		return this.userService.findOne(user.id.toString());
	}

	@Put('logout')
	async logoutCurrentUser(@Req() req): Promise<void> {
		req.user.status = status.OFFLINE;
		await this.userService.update(req.user);
		// DESTROY ACCESS TOKEN
	}

	@Get(':id_pseudo') // SEARCH BY PSEUDO INSTEAD OF PK
	async getOne(@Param() userId: string) {
		const user = await this.userService.findOne(userId);
		if (!user) {
			throw new HttpException('This user does not exist', 404);
		}
		return user;
	}

	@Delete(':id_pseudo') // SAME
	async removeOne(@Param() userId: string) {
		return this.userService.remove(userId);
	}
}
