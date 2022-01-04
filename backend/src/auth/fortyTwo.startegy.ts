import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(private authService: AuthService) {
		super({
			clientID:
				'1f8537877222f60ace53005c32c16aca6011f033aee8fd27fc9b05c9c29ee9be', // MUST BE ENV
			clientSecret:
				'd3d95f37b797b1cd54afe9eced1c9bb2e999cc8720acade02138bd3610450e96', // MUST BE ENV
			callbackURL: 'http://127.0.0.1:3000/login/42/redirect',
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
		// ACCESS AND REFRESH ??
		return cb(null, user);
	}
}
