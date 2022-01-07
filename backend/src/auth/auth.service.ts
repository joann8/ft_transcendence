import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Profile } from 'passport-42';
import { JwtService } from '@nestjs/jwt';
import { User, status } from 'src/user/entities/user.entity';

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
				user = await this.userService.createEntity({
					id: profile.id,
					id_pseudo: profile.username,
					avatar: profile.photos[0].value,
					email: profile.emails[0].value,
				});
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
		return this.jwtService.sign({
			username: user.id_pseudo,
			sub: user.id,
		});
	}

	async getUSerById(id: string): Promise<User> {
		return this.userService.findOne(id);
	}
}
