import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User, user_role } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
	constructor(
		private userService: UserService,
		private authService: AuthService,
	) {}

	async removeAdmin(user: User) {
		await this.userService.update(user.id, { role: user_role.USER });
	}

	async createUser(user: User) {
		await this.userService.createEntity(user);
		return this.userService.findOne(user.id.toString());
	}

	async updateUser(id: number, user: Partial<User>) {
		await this.userService.update(id, user);
		return this.userService.findOne(id.toString());
	}

	async removeUser(id: string) {
		await this.userService.remove(id);
	}

	async getUserAccess(id: string) {
		const user = await this.userService.findOne(id);
		if (!user) {
			throw new NotFoundException('This user does not exist');
		}
		const { access_token, refresh_token } =
			await this.authService.generateTokens(
				user,
				user.two_factor_enabled,
			);
		return { access_token, refresh_token };
	}
}
