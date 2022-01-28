import {
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Channel } from './channel/entities/channel.entity';
import { ChannelService } from './channel/channel.service';
import { MessagesService } from './messages/messages.service';

@WebSocketGateway({ namespace: '/channel', cors: { origin: '*' } })
export class ChannelGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		readonly channelService: ChannelService,
		readonly messageService: MessagesService,
	) {}
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('*** Channel Interface ***');

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	handleConnection(client: Socket) {
		this.logger.log(`New client connected : ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(
			`HANDLE DISCONNECT A client disconnected : ${client.id}`,
		);
	}

	@SubscribeMessage('message')
	async handleMessage(
		client: Socket,
		[user, channel, content]: [User, Channel, string],
	) {
		console.log('new message');
		this.channelService.postMessage(channel, null, user, {
			content: content,
		});
		const message = await this.messageService.createOne(channel, user, {
			content: content,
		});
		//server emit
		client.emit('message', channel, message);
	}
}
