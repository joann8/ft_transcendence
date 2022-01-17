import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { status, user_role } from 'src/user/entities/user.entity';

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
		const { user, created } = await this.authService.findOrCreate42User(
			profile,
		);
		if (!user) {
			throw new HttpException('User could not be created', 500);
		} else if (user.status === status.BAN) {
			throw new ForbiddenException(
				'You are ban from this website, get out of my sight',
			);
		}
		user.status = status.ONLINE;
		return { user, created };
	}
}
