import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Channel } from './chat/channel/entities/channel.entity';
import { Message } from './chat/messages/entities/message.entity';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { userChannelRole } from './chat/channel/entities/userChannelRole.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChannelService } from './chat/channel/channel.service';
import { PongModule } from './pong/pong.module';
import { PongService } from './pong/pong.service';
import { Pong } from './pong/entities/pong.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';
import { RelationModule } from './relation/relation.module';
import { Relation } from './relation/entities/relation.entity';
import { RelationService } from './relation/relation.service';
import { Challenge } from './pong/entities/challenge.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env.backend',
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DATABASE_HOST,
			port: parseInt(process.env.DATABASE_PORT),
			username: process.env.DATABASE_USERNAME,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME,
			entities: [
				User,
				Channel,
				Message,
				userChannelRole,
				Pong,
				Challenge,
				Relation,
			],
			// FIXME: REMOVE THOSE IN PRODUCTION
			synchronize: true,
			keepConnectionAlive: true,
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '/avatars/'),
			serveRoot: '/avatars/',
		}),
		UserModule,
		ChatModule,
		AuthModule,
		AdminModule,
		PongModule,
		RelationModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
		AppService,
		UserService,
		ChannelService,
		PongService,
		RelationService,
	],
})
export class AppModule {}
