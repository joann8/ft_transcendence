
import { IsOptional } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { relation } from "../entities/relation.entity";

export class UpdateRelationDto {

    id : number;
    
    relation1: relation;

    relation2: relation;
}
