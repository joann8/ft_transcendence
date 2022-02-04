
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { relation } from "../entities/relation.entity";
import { Type } from "class-transformer";

export class RelationDto {

    @IsOptional()
    @IsString()
    id_pseudo1: string

    @IsString()
    id_pseudo2: string

    @IsOptional()
    userId1: number;

    @IsOptional()
    userId2: number;

    @IsOptional()
    userId1bis : number;

    @IsOptional()
    userId2bis : number;

    @IsEnum(relation)
    relation1: relation;

    @IsEnum(relation)
    relation2: relation;
}
