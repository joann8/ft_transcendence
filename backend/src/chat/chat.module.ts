import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';

@Module({
<<<<<<< HEAD
  imports: [TypeOrmModule.forFeature([Chat])],
  exports: [TypeOrmModule],
  providers: [ChatService],
  controllers: [ChatController],
=======
	imports: [TypeOrmModule.forFeature([Chat])],
	exports: [TypeOrmModule],
	providers: [ChatService],
	controllers: [ChatController],
>>>>>>> master
})
export class ChatModule {}
