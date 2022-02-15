import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { status } from 'src/user/entities/user.entity';

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
			secretOrKey:
				'csd5d4c1dc16za5s4d5thib65la2314merguez!sc16q5d1s21pidvnpyouski',
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
			throw new UnauthorizedException(
				'You are ban from this website, get out of my sight',
			);
		}
		return await this.authService.set_online(user);
	}
}
