import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Request,
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
	async getCurrentUser(@Request() req) {
		return req.user;
	}

	@Get(':id_pseudo') // SEARCH BY PSEUDO INSTEAD OF PK
	getOne(@Param() userId: string) {
		return this.userService.findOne(userId);
	}

	@Delete(':id_pseudo') // SAME
	removeOne(@Param() userId: string) {
		return this.userService.remove(userId);
	}
}
