import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { Channel } from './channel.entity';
export enum channelRole {
	owner,
	admin,
	user,
	banned,
}
@Entity()
export class userChannelRole {
	@PrimaryColumn()
	userId: number;

	@PrimaryColumn()
	artistId: number;
	@ManyToOne((type) => User, (user) => user.channels)
	user: User;
	@ManyToOne((type) => Channel, (channel) => channel.users)
	channel: Channel;
	@Column({ default: channelRole.user })
	role: channelRole;
}
