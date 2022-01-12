import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Profile } from 'passport-42';
import { JwtService } from '@nestjs/jwt';
import { User, status, user_role } from 'src/user/entities/user.entity';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	async findOrCreate42User(profile: Profile): Promise<any> {
		let user = await this.userService.findOne(profile.id);
		if (!user) {
			try {
				user = await this.userService.createEntity({
					id: profile.id,
					id_pseudo: profile.username,
					email: profile.emails[0].value,
					avatar: profile.photos[0].value,
				});
			} catch (err) {
				console.error(err);
				return null;
			}
		}
		user.status = status.ONLINE;
		await this.userService.update(user.id, user);
		return user;
	}

	async generateAccessToken(user: User, isTwoFa: boolean = false) {
		const access_token = this.jwtService.sign({
			sub: user.id,
			mail: user.email,
			isTwoFa: isTwoFa,
		});
		return access_token;
	}

	async generateRefreshToken(user: User, isTwoFa: boolean = false) {
		const refresh_token = this.jwtService.sign(
			{
				sub: user.id,
				mail: user.email,
				isTwoFa: isTwoFa,
			},
			{
				secret: process.env.REFRESH_SECRET,
				expiresIn: '1d',
			},
		);
		const hash = await bcrypt.hash(refresh_token, 10);
		await this.userService.update(user.id, { refresh_token: hash });
		return refresh_token;
	}

	async generateTokens(user: User, isTwoFa: boolean = false) {
		const access_token = await this.generateAccessToken(user, isTwoFa);
		const refresh_token = await this.generateRefreshToken(user, isTwoFa);
		return { access_token, refresh_token };
	}

	async getUSerById(id: string): Promise<User> {
		return this.userService.findOne(id);
	}

	async logout(user: User): Promise<void> {
		await this.userService.update(user.id, {
			status: status.OFFLINE,
			refresh_token: null,
		});
	}

	async setAdmin(user: User): Promise<void> {
		await this.userService.update(user.id, { role: user_role.ADMIN });
	}

	async removeAdmin(user: User): Promise<void> {
		await this.userService.update(user.id, { role: user_role.USER });
	}

	async generateTwoFactorAuthentificationSecret(user: User) {
		const secret = user.two_factor_secret || authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(
			user.email,
			process.env.TWO_FACTOR_AUTH_APP_NAME,
			secret,
		);
		await this.userService.update(user.id, {
			two_factor_secret: secret,
		});
		return { secret, otpauthUrl };
	}

	async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	isTwoFaCodeValid(code: string, user: User) {
		return authenticator.verify({
			token: code,
			secret: user.two_factor_secret,
		});
	}

	async turnOnTwoFaAuth(user: User) {
		return this.userService.update(user.id, {
			two_factor_enabled: true,
		});
	}

	async turnOffTwoFaAuth(user: User) {
		return this.userService.update(user.id, {
			two_factor_enabled: false,
			two_factor_secret: null,
		});
	}
}
