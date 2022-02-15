import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';
import { status } from 'src/user/entities/user.entity';

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
			secretOrKey:
				'1704pas00les11doigts22sur33les44ecrans88svp99qmdnodedemon22qldj',
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
		} else if (user.status === status.BAN) {
			throw new UnauthorizedException(
				'You are ban from this website, get out of my sight',
			);
		}
		const match = await bcrypt.compare(
			req.cookies?.refresh_token,
			user.refresh_token,
		);
		if (!match) {
			throw new UnauthorizedException('Invalid Refresh token');
		}
		return await this.authService.set_online(user);
	}
}
