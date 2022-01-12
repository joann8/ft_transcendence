import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id_message: number;
	@Column({ default: 'default' })
	//mettre en unique ?
	content: string;
}
