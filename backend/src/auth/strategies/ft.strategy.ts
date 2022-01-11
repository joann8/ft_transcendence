import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(
	Strategy,
	'forty-two-strategy',
) {
	constructor(private authService: AuthService) {
		super({
			clientID: process.env.FT_CLIENT_ID,
			clientSecret: process.env.FT_CLIENT_SECRET,
			callbackURL: process.env.FT_CALLBACK_URL,
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		cb: VerifyCallback,
	): Promise<any> {
		const user = await this.authService.findOrCreate42User(profile);
		if (!user) {
			throw new HttpException('User could not be created', 500);
		}
		return cb(null, user);
	}
}
