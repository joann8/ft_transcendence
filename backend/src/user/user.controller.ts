import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	Put,
	Redirect,
	UseInterceptors,
	ClassSerializerInterceptor,
	HttpCode,
	ForbiddenException,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateCurrentUserDto } from './dto/updateCurrentUser.dto';
import { User, user_role } from './entities/user.entity';
import { UserService } from './user.service';
import { SecretDto } from 'src/auth/dto/secret.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// GET MY PROFILE
	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	async getCurrentUser(@Req() req): Promise<User> {
		return req.user;
	}
	// SEARCH AN USER
	@Public()
	@Get(':id_pseudo')
	@UseInterceptors(ClassSerializerInterceptor)
	async getUser(@Param() userId: string): Promise<User> {
		return this.userService.findOne(userId);
	}
	// UPDATE MY PROFILE (Look at UpdateCurrentUserDto for available options)
	@Put()
	@UseInterceptors(ClassSerializerInterceptor)
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
	// GIVE ADMIN ROLE TO CURRENT USER
	@Post('admin')
	@HttpCode(200)
	async setAdmin(@Req() req, @Body() adminSecret: SecretDto): Promise<void> {
		if (adminSecret.secret !== process.env['ADMIN_SECRET']) {
			throw new ForbiddenException('Wrong secret');
		}
		this.userService.update(req.user.id, { role: user_role.ADMIN });
	}
}
