import { type } from "os";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id_chat: number
    @Column({default : "default"})
    //mettre en unique ? 
    topic : string
    @ManyToOne(type => User, user => user.id)
    chanOwner : number
}