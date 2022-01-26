import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pong {
	@PrimaryGeneratedColumn()
	id_match: number;

	@ManyToOne((type) => User)
	winner: User;
	
	@Column({type : 'real'})
	scoreWinner : string 

	@ManyToOne((type) => User)
	looser: User;

	@Column({type : 'real'})
	scoreLooser : string;

	@CreateDateColumn()
	date : Date
}
