import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';
import { ChatService } from './chat/chat.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: 'config.env',
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'root',
			password: 'root',
			database: 'test',
			entities: [User, Chat],
			synchronize: true,
		}),
		UserModule,
		ChatModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService, UserService, ChatService],
})
export class AppModule {}
