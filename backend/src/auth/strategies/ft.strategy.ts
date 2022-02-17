import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import {
	HttpException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { status } from 'src/user/entities/user.entity';

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
		let { user, created } = await this.authService.findOrCreate42User(
			profile,
		);
		let error = false;
		if (!user || user.status === status.BAN) {
			error = true;
		}
		user = await this.authService.set_online(user);
		return { user, created, error };
	}
}
