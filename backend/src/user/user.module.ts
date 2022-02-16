import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ChannelModule } from 'src/chat/channel/channel.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		MulterModule.register({
			dest: './avatars',
		}),
		ChannelModule,
	],
	exports: [TypeOrmModule, UserService],
	providers: [UserService],
	controllers: [UserController],
})
export class UserModule {}
