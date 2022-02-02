
import { IsEnum, IsNumber, IsString } from "class-validator";
import { relation } from "../entities/relation.entity";

export class UpdateRelationDto {

    @IsNumber()
    id : number;

    @IsNumber()
    userId1: number;

    @IsNumber()
    userId2: number;
    
    @IsEnum(relation)
    relation1: relation;

    @IsEnum(relation)
    relation2: relation;
}
