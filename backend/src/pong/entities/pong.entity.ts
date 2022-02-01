import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pong {
	@PrimaryGeneratedColumn()
	id_match: number;

	@ManyToOne((type) => User)
	player1: User;
	
	@Column({default : "0", type : 'real'})
	scorePlayer1 : string;

	@ManyToOne((type) => User)
	player2: User;

	@Column({default : "0",type : 'real'})
	scorePlayer2 : string;

	@CreateDateColumn()
	date : Date;

	@Column()
	room: string;

	@Column( { default : "ongoing"})
	status : string;
}
