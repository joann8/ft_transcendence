import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, OneToMany} from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ default: true })
    isActive: boolean;
}