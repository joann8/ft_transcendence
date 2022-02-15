import { Message } from 'src/chat/messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateChannelDto } from '../dto/create-channel-dto';
import { userChannelRole } from './userChannelRole.entity';

export enum channelType {
	PUBLIC,
	PRIVATE,
	DIRECT,
}

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@Column()
	mode: channelType;

	@Column({ nullable: true })
	password?: string;

	@OneToMany((type) => Message, (message) => message.channel, {
		cascade: true,
	})
	messages: Message[];

	@OneToMany(
		(type) => userChannelRole,
		(userChannelRole) => userChannelRole.channel,
		{
			cascade: true,
		},
	)
	roles!: userChannelRole[];
}
