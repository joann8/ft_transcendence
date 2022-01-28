import { type } from "os";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum relation {
    SEND,
    RECEIVE,
    FRIEND,
    BLOCK ,
    BLOCKED
}

@Entity()
export class Relation {
    
    @PrimaryGeneratedColumn()
    id : number

   // @Column()
    @ManyToOne(() => User, user => user.id)
    userId1: number

   // @Column()
    @ManyToOne(type => User, user => user.id )
    userId2: number //type User ou type number ? 

    @Column()
    relation1: relation

    @Column()
    relation2: relation
}
