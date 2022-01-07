import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	exports: [TypeOrmModule, UserService],
	providers: [UserService],
	controllers: [UserController],
})
export class UserModule {}
