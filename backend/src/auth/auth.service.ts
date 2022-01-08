import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Profile } from 'passport-42';
import { JwtService } from '@nestjs/jwt';
import { User, status, user_role } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	async findOrCreate42User(profile: Profile): Promise<any> {
		let user = await this.userService.findOne(profile.id);
		if (!user) {
			try {
				user = await this.userService.createEntity(
					new User(
						profile.id,
						profile.username,
						profile.emails[0].value,
						profile.photos[0].value,
					),
				);
			} catch (err) {
				console.error(err);
				return null;
			}
		}
		user.status = status.ONLINE;
		await this.userService.update(user);
		return user;
	}

	async login(user: User) {
		const access_token = await this.jwtService.sign({
			username: user.id_pseudo,
			sub: user.id,
		});
		console.log(`${user.id_pseudo} logged in !`);
		// FIXME: REMOVE IN PRODUCTION
		console.log(`access_token=${access_token}`);
		return access_token;
	}

	async getUSerById(id: string): Promise<User> {
		return this.userService.findOne(id);
	}

	async logout(user: User): Promise<void> {
		user.status = status.OFFLINE;
		await this.userService.update(user);
	}

	async setAdmin(user: User): Promise<void> {
		user.role = user_role.ADMIN;
		await this.userService.update(user);
	}

	async removeAdmin(user: User): Promise<void> {
		user.role = user_role.USER;
		await this.userService.update(user);
	}
}
