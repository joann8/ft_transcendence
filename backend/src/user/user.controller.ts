import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Req,
	Put,
	Redirect,
} from '@nestjs/common';
import { UpdateCurrentUserDto } from './dto/updateCurrentUser.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// GET MY PROFILE
	@Get()
	async getCurrentUser(@Req() req): Promise<User> {
		return req.user;
	}

	// SEARCH AN USER
	@Get(':id_pseudo')
	async getUser(@Param() userId: string): Promise<User> {
		return this.userService.findOne(userId);
	}

	// UPDATE MY PROFILE (Look at UpdateCurrentUserDto for available options)
	@Put()
	async updateCurrentUser(
		@Req() req,
		@Body() updateCurrentUserDto: UpdateCurrentUserDto,
	): Promise<User> {
		await this.userService.update(req.user.id, updateCurrentUserDto);
		return this.userService.findOne(req.user.id.toString());
	}
	// DELETE MY PROFILE
	@Delete()
	@Redirect('/')
	async deleteCurrentUser(@Req() req): Promise<void> {
		this.userService.remove(req.user.id);
	}

	//Get leaderBoard
	@Get(':id/leaderboard')
	async getLeaderboard(): Promise<User[]> {
		return this.userService.getLeaderboard();
	}
}

