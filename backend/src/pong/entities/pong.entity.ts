import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pong {
	@PrimaryGeneratedColumn()
	id_match: number;
	
	@ManyToOne((type) => User, (user) => user.id)
	winner : number;

	@Column()
	scoreWinner : number 

	@ManyToOne((type) => User, (user) => user.id)
	looser: number;

	@Column()
	scoreLooser : number 

	@Column()
	date : number
}
