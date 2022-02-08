import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { status, User, user_role } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
	constructor(private userService: UserService) {}

	async getAllUsers() {
		return await this.userService.findAll();
	}

	async removeAdmin(user: User) {
		if (user.role === user_role.OWNER) {
			throw new ForbiddenException(
				"You can't remove your admin rights, boss",
			);
		}
		await this.userService.update(user.id, { role: user_role.USER });
	}

	async removeAdminRole(id: string) {
		const user = await this.userService.findOne(id);
		if (!user) {
			throw new NotFoundException('This user does not exist');
		}
		if (user.role === user_role.OWNER) {
			throw new ForbiddenException(
				"You can't remove admin rights from the boss",
			);
		}
		await this.userService.update(user.id, { role: user_role.USER });
	}

	async banUser(admin: User, id: string) {
		const user = await this.userService.findOne(id);
		if (!user) {
			throw new NotFoundException('This user does not exist');
		}
		if (user.role === user_role.OWNER) {
			throw new ForbiddenException("You can't ban the boss");
		}
		if (user.status === status.BAN) {
			throw new ForbiddenException('This user is already ban');
		}
		if (admin.role === user_role.ADMIN && user.role === user_role.ADMIN) {
			throw new ForbiddenException("You can't ban another admin");
		}
		await this.userService.update(user.id, { status: status.BAN });
	}

	async unbanUser(admin: User, id: string) {
		const user = await this.userService.findOne(id);
		if (!user) {
			throw new NotFoundException('This user does not exist');
		}
		if (user.status !== status.BAN) {
			throw new ForbiddenException('This user has not been banned');
		}
		await this.userService.update(user.id, { status: status.OFFLINE });
	}

	async setAdmin(id: string) {
		const user = await this.userService.findOne(id);
		if (!user) {
			throw new NotFoundException('This user does not exist');
		}
		await this.userService.update(user.id, { role: user_role.ADMIN });
	}
}
