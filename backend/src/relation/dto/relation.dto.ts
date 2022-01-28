
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { relation } from "../entities/relation.entity";
import { Type } from "class-transformer";

export class RelationDto {

    @IsString()
    id_pseudo1: string

    @IsString()
    id_pseudo2: string

    @IsOptional()
    @IsNumber()
    userId1: number;

    @IsOptional()
    @IsNumber()
    userId2: number;

    @IsEnum(relation)
    relation1: relation;

    @IsEnum(relation)
    relation2: relation;
}
