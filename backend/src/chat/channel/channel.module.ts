import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { userChannelRole } from './entities/userChannelRole.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channel, userChannelRole])],
	exports: [TypeOrmModule],
	providers: [ChannelService],
	controllers: [ChannelController],
})
export class ChannelModule {}
