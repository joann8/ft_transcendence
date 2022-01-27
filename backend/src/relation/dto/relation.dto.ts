
import { User } from "src/user/entities/user.entity";
import { relation } from "../entities/relation.entity";

export class RelationDto {

    user1: User;

    user2: User;

    relation1: relation;

    relation2: relation;
}
