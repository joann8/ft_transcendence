import { Exclude } from 'class-transformer';
import { Channel } from 'src/chat/channel/entities/channel.entity';
import { userChannelRole } from 'src/chat/channel/entities/userChannelRole.entity';
import { Message } from 'src/chat/messages/entities/message.entity';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
} from 'typeorm';

export enum status {
	OFFLINE = 'OFFLINE',
	ONLINE = 'ONLINE',
	IN_GAME = 'IN GAME',
	BAN = 'BAN',
}

export enum user_role {
	OWNER = 'owner',
	ADMIN = 'admin',
	USER = 'user',
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

	@Column({ nullable: true })
	avatar: string;

	@Column({ unique: true })
	email: string;

	@Column({ default: user_role.USER })
	role?: user_role;

	@Column({ default: 3000 })
	elo?: number;

	@Column({ default: status.OFFLINE })
	status?: status;

	@Column({ default: false })
	two_factor_enabled?: boolean;

	@Column({ nullable: true })
	@Exclude()
	two_factor_secret?: string;

	@Column({ nullable: true })
	@Exclude()
	refresh_token?: string;

	@Column({ default: false })
	achievement1?: boolean;

	@Column({ default: false })
	achievement2?: boolean;

	@OneToMany((type) => userChannelRole, (role) => role.user, {
		cascade: true,
	})
	@JoinTable()
	channels: userChannelRole[];
}
