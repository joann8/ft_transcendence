import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { UserHttpModule } from './user-http/user-http.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
    UserHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
