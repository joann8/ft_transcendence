import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
	@PrimaryGeneratedColumn()
	id_chat: number;
	@Column({ default: 'default' })
	//mettre en unique ?
	topic: string;
	@ManyToOne((type) => User, (user) => user.id)
	chanOwner: number;
}
