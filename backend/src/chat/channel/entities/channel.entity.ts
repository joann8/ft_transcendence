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

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 'default' })
	name: string;

	@OneToMany((type) => Message, (message) => message.channel, {
		cascade: true,
	})
	messages: Message[];

	@OneToMany((type) => userChannelRole, (role) => role.channel, {
		onDelete: 'CASCADE',
	})
	users: userChannelRole[];
}
