import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh-token',
) {
	constructor(private authService: AuthService) {
		super({
			jwtFromRequest: (req: Request) => {
				if (!req || !req.cookies || !req.cookies.refresh_token) {
					return null;
				}
				return req.cookies.refresh_token;
			},
			secretOrKey: process.env.REFRESH_SECRET,
			ignoreExpiration: false,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: any) {
		if (!payload) {
			throw new UnauthorizedException('Invalid token');
		}
		const user = await this.authService.getUSerById(payload.sub);
		if (!user || !user.refresh_token) {
			throw new UnauthorizedException(
				'Token does not match any user in DB',
			);
		}
		const match = await bcrypt.compare(
			req.cookies?.refresh_token,
			user.refresh_token,
		);
		if (!match) {
			throw new UnauthorizedException('Invalid Refresh token');
		}
		return user;
	}
}
