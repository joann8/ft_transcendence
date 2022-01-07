import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './fortyTwo.startegy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret, // CHANGE IT AND PUT IT ENV
			signOptions: { expiresIn: '1h' },
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
