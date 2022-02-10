import { User } from 'src/user/entities/user.entity';
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Challenge {
	@PrimaryGeneratedColumn()
	id_challenge: number;

	@ManyToOne((type) => User)
	challenger: User;

	@ManyToOne((type) => User)
	challengee: User;

	@CreateDateColumn()
	date : Date
}
