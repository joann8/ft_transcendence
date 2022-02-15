import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './strategies/ft.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFaJwtAuthGuard } from './guards/twofajwt_auth.guard';
import { TwoFaJwtStrategy } from './strategies/twofajwt.strategy';
import { RefreshJwtStrategy } from './strategies/refreshjwt.strategy';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: 'src/auth/config/auth.env',
		}),
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: 'csd5d4c1dc16za5s4d5thib65la2314merguez!sc16q5d1s21pidvnpyouski',
			signOptions: { expiresIn: '1h' },
		}),
	],
	providers: [
		AuthService,
		FortyTwoStrategy,
		JwtStrategy,
		TwoFaJwtStrategy,
		RefreshJwtStrategy,
		{ provide: APP_GUARD, useClass: TwoFaJwtAuthGuard },
	],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
