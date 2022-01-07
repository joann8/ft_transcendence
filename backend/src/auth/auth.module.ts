import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './strategies/ft.startegy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from './guards/jwt_auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: 'src/auth/config/auth.env',
		}),
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: process.env['JWT_SECRET'],
			signOptions: { expiresIn: '7h' },
		}),
	],
	providers: [
		AuthService,
		FortyTwoStrategy,
		JwtStrategy,
		{ provide: APP_GUARD, useClass: JwtAuthGuard },
	],
	controllers: [AuthController],
})
export class AuthModule {}
