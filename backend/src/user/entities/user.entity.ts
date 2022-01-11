import { Exclude } from 'class-transformer';
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
	@PrimaryColumn({ unique: true })
	id: number;

	@Column({ unique: true })
	id_pseudo: string;

	@Column()
	avatar: string;

	@Column({ unique: true })
	email: string;

	@Column({ default: user_role.USER })
	role?: user_role;

	@Column({ default: 3000 })
	elo?: number;

	// TODO: TOM
	@Column({ default: status.OFFLINE })
	status?: status;

	@Column({ nullable: true })
	@Exclude()
	two_factor_secret?: string;

	@Column({ default: false })
	two_factor_enabled?: boolean;

	@Column({ default: false })
	achievement1?: boolean;

	@Column({ default: false })
	achievement2?: boolean;

	@OneToMany((type) => Chat, (chat) => chat.id_chat)
	chatList?: Chat[];
}
