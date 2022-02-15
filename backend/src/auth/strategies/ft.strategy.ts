import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import {
	HttpException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { status, user_role } from 'src/user/entities/user.entity';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(
	Strategy,
	'forty-two-strategy',
) {
	constructor(private authService: AuthService) {
		super({
			clientID:
				'1f8537877222f60ace53005c32c16aca6011f033aee8fd27fc9b05c9c29ee9be',
			clientSecret:
				'd3d95f37b797b1cd54afe9eced1c9bb2e999cc8720acade02138bd3610450e96',
			callbackURL: 'http://127.0.0.1:3001/login/42/redirect',
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
		if (!user) {
			throw new HttpException('User could not be created', 500);
		} else if (user.status === status.BAN) {
			throw new UnauthorizedException(
				'You are ban from this website, get out of my sight',
			);
		}
		user = await this.authService.set_online(user);
		return { user, created };
	}
}
