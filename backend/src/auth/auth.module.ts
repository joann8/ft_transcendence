import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './fortyTwo.startegy';
import { AuthController } from './auth.controller';

@Module({
	imports: [UserModule, PassportModule],
	providers: [AuthService, FortyTwoStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
