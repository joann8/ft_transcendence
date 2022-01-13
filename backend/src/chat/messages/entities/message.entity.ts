import { Channel } from 'src/chat/channel/entities/channel.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ default: 'default' })
	content: string;
	@ManyToOne((type) => Channel, (channel) => channel.messages, {
		onDelete: 'CASCADE',
	})
	channel: Channel;
}
