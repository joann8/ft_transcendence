import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Profile } from 'passport-42';
import { JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { User, status, user_role } from 'src/user/entities/user.entity';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { toFileStream } from 'qrcode';

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

	async login(user: User) {
		const access_token = await this.jwtService.sign({
			sub: user.id,
			mail: user.email,
		});
		return { user, access_token };
	}

	async getUSerById(id: string): Promise<User> {
		return this.userService.findOne(id);
	}

	async logout(user: User): Promise<void> {
		user.status = status.OFFLINE;
		await this.userService.update(user.id, user);
	}

	async setAdmin(user: User): Promise<void> {
		user.role = user_role.ADMIN;
		await this.userService.update(user.id, user);
	}

	async removeAdmin(user: User): Promise<void> {
		user.role = user_role.USER;
		await this.userService.update(user.id, user);
	}

	async generateTwoFactorAuthentificationSecret(user: User) {
		const secret = authenticator.generateSecret();
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

	async getTwoFaAccessToken(user: User, isTwoFa = false) {
		const access_token = await this.jwtService.sign({
			sub: user.id,
			mail: user.email,
			isTwoFa: isTwoFa,
		});
		return access_token;
	}
}
