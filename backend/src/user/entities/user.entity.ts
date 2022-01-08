import { Chat } from 'src/chat/chat.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

export enum status {
	OFFLINE = 'OFFLINE',
	ONLINE = 'ONLINE',
}

export enum user_role {
	USER = 'user',
	ADMIN = 'admin',
}

/*	
	User class definition.
	Thanks to update the dtos when updating this class
*/
@Entity()
export class User {
	constructor(id: number, id_pseudo: string, email: string, avatar: string) {
		this.id = id;
		this.id_pseudo = id_pseudo;
		this.email = email;
		this.avatar = avatar;
	}

	@PrimaryColumn({ unique: true })
	id: number;

	@Column({ unique: true })
	id_pseudo: string;

	@Column()
	avatar: string;

	@Column({ unique: true })
	email: string;

	@Column({ default: user_role.USER })
	role: user_role;

	@Column({ default: 3000 })
	elo: number;

	// TODO: TOM
	@Column({ default: status.OFFLINE })
	status: status;

	// TODO: TOM
	@Column({ default: false })
	two_factor: boolean;

	@Column({ default: false })
	achievement1: boolean;

	@Column({ default: false })
	achievement2: boolean;

	@OneToMany((type) => Chat, (chat) => chat.id_chat)
	chatList: Chat[];
}
