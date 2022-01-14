import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([Message])],
	exports: [TypeOrmModule],
	providers: [MessagesService],
	controllers: [MessagesController],
})
export class MessagesModule {}
