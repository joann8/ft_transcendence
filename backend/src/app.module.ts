import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Chat } from './chat/chat.entity';
import { AdminModule } from './admin/admin.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
			entities: [User, Chat],
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
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
		AppService,
		UserService,
		ChatService,
	],
})
export class AppModule {}
