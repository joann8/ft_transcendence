import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Channel } from './chat/channel/entities/channel.entity';
import { Message } from './chat/messages/entities/message.entity';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { userChannelRole } from './chat/channel/entities/userChannelRole.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: 'config.env',
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DATABASE_HOST,
			port: parseInt(process.env.DATABASE_PORT),
			username: process.env.DATABASE_USERNAME,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME,
			entities: [User, Channel, Message, userChannelRole],
			// FIXME: REMOVE THOSE IN PRODUCTION
			synchronize: true,
			keepConnectionAlive: true,
		}),
		UserModule,
		ChatModule,
		AuthModule,
		AdminModule,
	],
	controllers: [AppController],
	providers: [AppService, UserService],
})
export class AppModule {}
