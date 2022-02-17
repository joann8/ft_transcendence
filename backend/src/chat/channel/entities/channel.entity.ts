import { Message } from 'src/chat/messages/entities/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

	@Column({ nullable: true })
	idOne?: number;

	@Column({ nullable: true })
	idTwo?: number;

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
