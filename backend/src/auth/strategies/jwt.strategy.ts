import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { status, user_role } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
		} else if (user.status === status.BAN) {
			throw new ForbiddenException(
				'You are ban from this website, get out of my sight',
			);
		}
		return user;
	}
}
