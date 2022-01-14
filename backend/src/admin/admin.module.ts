import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: 'src/admin/config/admin.env',
		}),
		UserModule,
		AuthModule,
	],
	exports: [AdminService],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
