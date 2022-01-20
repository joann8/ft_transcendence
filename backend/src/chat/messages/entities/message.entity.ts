import { Channel } from 'src/chat/channel/entities/channel.entity';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('message', {
	orderBy: {
		date: 'ASC',
	},
})
export class Message {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ default: 'default' })
	content: string;
	@ManyToOne((type) => Channel, (channel) => channel.messages)
	channel: Channel;
	@ManyToOne((type) => User)
	author: User;
	@CreateDateColumn()
	date: Date;
}
