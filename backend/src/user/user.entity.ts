import { Chat } from 'src/chat/chat.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';

export enum status {
	OFFLINE,
	INLINE,
}

@Entity()
export class User {
	@PrimaryColumn({ unique: true })
	id: number;

	@Column({ unique: true })
	id_pseudo: string;

	@Column()
	avatar: string;

	@Column({ unique: true })
	email: string;

	@Column({ default: false })
	admin: boolean;

	@Column({ default: 3000 })
	elo: number;

	// A GERER: TOM
	@Column({ default: status.OFFLINE })
	status: status;

	// SETUP: ADRIEN -- A GERER: TOM
	@Column({ default: false })
	two_factor: boolean;

	@Column({ default: false })
	achievement1: boolean;

	@Column({ default: false })
	achievement2: boolean;

	@OneToMany((type) => Chat, (chat) => chat.id_chat)
	chatList: Chat[];
}
