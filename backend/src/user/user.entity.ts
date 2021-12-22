import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, OneToMany, PrimaryColumn} from "typeorm";


enum status {
    OFFLINE,
    INLINE,
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    id_pseudo: string

    @Column({default: "/default/path/to/avatar"})
    avatar: string

    @Column({default: "default@default.fr", unique: true})
    email: string

    @Column({default: "123456789"})
    password: string

    @Column({default: 3000})
    elo: number

    @Column({default: false})
    admin: boolean

    @Column({default: status.OFFLINE})
    status: status

    @Column({default: false})
    two_factor: boolean

    @Column({default: false})
    isAuth: boolean

    @Column({default: false})
    achievement1: boolean

    @Column({default: false})
    achievement2: boolean
    
}