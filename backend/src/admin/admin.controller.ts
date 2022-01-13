import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Redirect,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/admin/guards/admin.guard';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';
import { User } from 'src/user/entities/user.entity';
import { AdminService } from './admin.service';

/*
	ADMIN CONTROLLER DEFINITION
	Post to /user/admin with {"secret": "admin_secret"} to get admin rights
*/
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
	constructor(private adminService: AdminService) {}
	// REMOVE ADMIN ROLE FROM CURRENT USER
	@Delete()
	@HttpCode(200)
	async removeAdmin(@Req() req): Promise<void> {
		await this.adminService.removeAdmin(req.user);
	}
	// CREATE AN USER (Admin only)
	@Post('create')
	async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.adminService.createUser(createUserDto);
	}
	// UPDATE AN USER (Admin only)
	@Put('update')
	async updateUSer(@Body() updateUserDto: UpdateUserDto): Promise<User> {
		return this.adminService.updateUser(updateUserDto.id, updateUserDto);
	}
	// DELETE AN USER (Admin only)
	@Delete(':id_pseudo')
	async removeUser(@Param() userId: string): Promise<void> {
		this.adminService.removeUser(userId);
	}
	// GET ACCESS TO id_pseudo
	@Get('access/:id_pseudo')
	@Redirect('/user')
	async getUserAccess(@Param() userId: string) {
		return this.adminService.getUserAccess(userId);
	}
	// SWITCH TO id_pseudo
	@Get('switch/:id_pseudo')
	@Redirect('/user')
	async switchToUser(
		@Param() userId: string,
		@Res({ passthrough: true }) res,
	) {
		const { access_token, refresh_token } = await this.getUserAccess(
			userId,
		);
		res.cookie('access_token', access_token);
		res.cookie('refresh_token', refresh_token);
	}
}
