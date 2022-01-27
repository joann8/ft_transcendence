import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum relation {
    FRIEND = "FRIEND",
    SEND = "SEND",
    RECEIVE = "RECEIVE",
    BLOCK = "BLOCK",
    BLOCKED = "BLOCKED",
}

@Entity()
export class Relation {
    
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    @ManyToOne((type) => User)
    user1: User

    @Column()
    @ManyToOne((type) => User)
    user2: User

    @Column()
    relation1: relation

    @Column()
    relation2: relation
}
