import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Profile } from 'passport-42';

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

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
		return user;
	}
}
