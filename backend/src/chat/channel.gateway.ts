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
	private clientsRooms = {};
	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	handleConnection(client: Socket) {
		this.logger.log(`New client connected : ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		if (this.clientsRooms[`${client.id}`]) {
			client.leave(this.clientsRooms[`${client.id}`]);
			this.logger.log(
				`client : ${client.id} leave ${
					this.clientsRooms[`${client.id}}`]
				}`,
			);
		}
		this.logger.log(
			`HANDLE DISCONNECT A client disconnected : ${client.id}`,
		);
	}

	@SubscribeMessage('channelConnect')
	async connectToChannel(client: Socket, channel: Channel) {
		if (this.clientsRooms[`${client.id}`]) {
			client.leave(this.clientsRooms[`${client.id}`]);
			this.logger.log(
				`client : ${client.id} leave ${
					this.clientsRooms[`${client.id}`]
				}`,
			);
		}
		client.join(`${channel.name}`);
		this.clientsRooms[`${client.id}`] = channel.name;
		this.logger.log(
			`client : ${client.id} joined ${this.clientsRooms[`${client.id}`]}`,
		);
	}
	@SubscribeMessage('reload')
	async handleReload(client: Socket, channel: Channel) {
		//server emit
		this.server.to(`${channel.name}`).emit('reload');
	}
	@SubscribeMessage('message')
	async handleMessage(
		client: Socket,
		[user, channel, content]: [User, Channel, string],
	) {
		const ret = await this.channelService.postMessage(channel, null, user, {
			content: content,
		});

		if (ret) {
			client.emit('exception', ret);
			return;
		}
		const message = await this.messageService.createOne(channel, user, {
			content: content,
		});
		//server emit
		this.server.to(`${channel.name}`).emit('message', channel, message);
	}
}
