import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	HttpException,
	Req,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.createEntity(createUserDto);
	}

	@Get()
	async getCurrentUser(@Req() req) {
		return req.user;
	}

	@Get(':id_pseudo') // SEARCH BY PSEUDO INSTEAD OF PK
	getOne(@Param() userId: string) {
		const ret = this.userService.findOne(userId);
		if (!ret) {
			throw new HttpException('This user does not exist', 404);
		}
		return ret;
	}

	@Delete(':id_pseudo') // SAME
	removeOne(@Param() userId: string) {
		return this.userService.remove(userId);
	}
}
