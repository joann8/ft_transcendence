import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pong {
	@PrimaryGeneratedColumn()
	id_match: number;

	@ManyToOne((type) => User)
	winner: User;
	/*
	@ManyToOne((type) => User, (user) => user.id_pseudo)
	winner_pseudo: string;
	*/
	/*
	@ManyToOne((type) => User, (user) => user.id_pseudo)
	winner_pseudo : number;
	*/
	@Column({type : 'real'})
	scoreWinner : string 

	@ManyToOne((type) => User)
	looser: User;

	/*
	@ManyToOne((type) => User, (user) => user.id_pseudo)
	looser_pseudo: string;
	*/
	/*
	@ManyToOne((type) => User, (user) => user.id_pseudo)
	looser_pseudo : number;
	*/
	@Column({type : 'real'})
	scoreLooser : string;

	@CreateDateColumn()
	date : Date
}
