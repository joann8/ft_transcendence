import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
export enum channelRole {
	owner = 'owner',
	admin = 'admin',
	user = 'user',
	banned = 'banned',
}
@Entity()
export class userChannelRole {
	@PrimaryGeneratedColumn()
	public id!: number;
	@ManyToOne((type) => User, (user) => user.roles)
	@JoinColumn()
	public user!: User;
	@ManyToOne((type) => Channel, (channel) => channel.roles)
	@JoinColumn()
	public channel!: Channel;
	@Column({ default: channelRole.user })
	public role!: channelRole;
}
