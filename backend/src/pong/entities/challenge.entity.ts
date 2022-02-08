import { Socket } from 'socket.io';
import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Challenge {
	@PrimaryGeneratedColumn()
	id_challenge: number;

	@ManyToOne((type) => User)
	challenger: User;

	@ManyToOne((type) => User)
	challengee: User;

	@Column()
	status : string;

	@CreateDateColumn()
	date : Date
}
