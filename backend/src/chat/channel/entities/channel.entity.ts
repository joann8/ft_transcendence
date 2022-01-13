import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id_channel: number;
	@Column({ default: 'default' })
	name: string;
	//@ManyToOne((type) => User, (user) => user.id)
	//chanOwner: number;
}
