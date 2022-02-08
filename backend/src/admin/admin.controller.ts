import {
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/admin/guards/admin.guard';
import { AdminService } from './admin.service';
import { OwnerGuard } from './guards/owner.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
	constructor(private adminService: AdminService) {}
	@Get('users')
	async getAllUsers() {
		return await this.adminService.getAllUsers();
	}
	// GIVE ADMIN ROLE TO USER
	@UseGuards(OwnerGuard)
	@Put(':id_pseudo')
	async setAdmin(@Param() userId: string): Promise<void> {
		await this.adminService.setAdmin(userId);
	}
	// REMOVE ADMIN ROLE FROM CURRENT USER
	@Delete()
	@HttpCode(200)
	async removeAdmin(@Req() req): Promise<void> {
		await this.adminService.removeAdmin(req.user);
	}
	// REMOVE ADMIN ROLE FROM ANY USER
	@UseGuards(OwnerGuard)
	@Delete(':id_pseudo')
	async removeAdminRole(@Param() userId: string): Promise<void> {
		await this.adminService.removeAdminRole(userId);
	}
	// BAN AN USER
	@Put('ban/:id_pseudo')
	async banUser(@Req() req, @Param() userId: string): Promise<void> {
		await this.adminService.banUser(req.user, userId);
	}
	// UNBAN AN USER
	@Put('unban/:id_pseudo')
	async unbanUser(@Req() req, @Param() userId: string): Promise<void> {
		await this.adminService.unbanUser(req.user, userId);
	}
}
