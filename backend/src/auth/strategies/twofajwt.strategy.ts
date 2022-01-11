import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class TwoFaJwtStrategy extends PassportStrategy(
	Strategy,
	'jwt-two-factors',
) {
	constructor(private authService: AuthService) {
		super({
			jwtFromRequest: (req: Request) => {
				if (!req || !req.cookies || !req.cookies.access_token) {
					return null;
				}
				return req.cookies.access_token;
			},
			secretOrKey: process.env.JWT_SECRET,
			ignoreExpiration: false,
		});
	}

	async validate(payload: any) {
		if (!payload) {
			throw new UnauthorizedException('Invalid token');
		}
		const user = await this.authService.getUSerById(payload.sub);
		if (!user) {
			throw new UnauthorizedException(
				'Token does not match any user in DB',
			);
		}
		if (!user.two_factor_enabled || payload.isTwoFa) {
			return user;
		}
		throw new UnauthorizedException('Please authenticate with 2FA');
	}
}
