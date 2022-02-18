import {
	ForbiddenException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
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

	private logger: Logger = new Logger();

	async findOrCreate42User(profile: Profile): Promise<any> {
		let created = false;
		let user = await this.userService.findOne(profile.id);
		if (!user) {
			let role = user_role.USER;
			let u = await this.userService.getNbUsers();
			if (!u) {
				role = user_role.OWNER;
			}
			try {
				user = await this.userService.createEntity({
					id: profile.id,
					id_pseudo: profile.username,
					email: profile.emails[0].value,
					avatar: profile.photos[0].value,
					role: role,
					roles: [],
				});
			} catch (err) {
				return null;
			}
			created = true;
		}
		return { user, created };
	}

	async ft_login(user: User) {
		const { access_token, refresh_token } = await this.generateTokens(user);
		this.logger.log(`${user.id_pseudo} logged in with 42 intranet !`);
		return { access_token, refresh_token };
	}

	async two_fa_login(user: User, secret: string) {
		if (!user.two_factor_enabled) {
			throw new ForbiddenException(
				'Please turn-on 2FA before doing this',
			);
		}
		if (!this.isTwoFaCodeValid(secret, user)) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		const { access_token, refresh_token } = await this.generateTokens(
			user,
			true,
		);
		this.logger.log(`${user.id_pseudo} authenticate with 2FA !`);
		return { access_token, refresh_token };
	}

	async getUSerById(id: string): Promise<User> {
		return this.userService.findOne(id);
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

	async set_online(user: User): Promise<User> {
		await this.userService.update(user.id, {
			status: status.ONLINE,
		});
		return this.userService.findOne(user.id.toString());
	}

	async logout(user: User): Promise<void> {
		await this.userService.update(user.id, {
			status: status.OFFLINE,
			refresh_token: null,
		});
		this.logger.log(`${user.id_pseudo} logged out...`);
	}

	async generateTwoFactorAuthentificationSecret(user: User) {
		if (user.two_factor_enabled) {
			throw new ForbiddenException('2FA is already on for this user');
		}
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

	async turnOnTwoFaAuth(user: User, secret: string) {
		if (user.two_factor_enabled) {
			throw new ForbiddenException('2FA is already on for this user');
		}
		if (!this.isTwoFaCodeValid(secret, user)) {
			throw new ForbiddenException(
				'Wrong authentication code. Please try to generate 2FA QR Code first',
			);
		}
		const { access_token, refresh_token } = await this.generateTokens(
			user,
			true,
		);
		await this.userService.update(user.id, {
			two_factor_enabled: true,
		});
		this.logger.log(`${user.id_pseudo} turned on 2FA !`);
		return { access_token, refresh_token };
	}

	async turnOffTwoFaAuth(user: User) {
		if (!user.two_factor_enabled) {
			throw new ForbiddenException('2FA is already off for this user');
		}
		await this.userService.update(user.id, {
			two_factor_enabled: false,
			two_factor_secret: null,
		});
		this.logger.log(`${user.id_pseudo} turned off 2FA...`);
	}

	async refresh_access_token(user: User) {
		const access_token = await this.generateAccessToken(
			user,
			user.two_factor_enabled,
		);
		this.logger.log(`${user.id_pseudo} refreshed his access_token !`);
		return access_token;
	}
}
