import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Profile } from 'passport-42';

@Injectable()
export class AuthService {
	constructor(private userService: UserService) {}

	async findOrCreate42User(profile: Profile): Promise<any> {
		let user = await this.userService.findOne(profile.id); // VERIFIER
		if (!user) {
			try {
				user = await this.userService.createEntity({
					id: profile.id,
					id_pseudo: profile.login,
					avatar: profile.image_url,
					email: profile.email,
				});
			} catch (err) {
				console.error(err);
				return null;
			}
		}
		return user;
	}
}
