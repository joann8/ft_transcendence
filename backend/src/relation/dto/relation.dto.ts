import { IsEnum, IsOptional, IsString } from 'class-validator';
import { relation } from '../entities/relation.entity';

export class RelationDto {
	@IsOptional()
	@IsString()
	id_pseudo1: string;

	@IsString()
	id_pseudo2: string;

	@IsOptional()
	userId1: number;

	@IsOptional()
	userId2: number;

	@IsOptional()
	userId1bis: number;

	@IsOptional()
	userId2bis: number;

	@IsEnum(relation)
	relation1: relation;

	@IsEnum(relation)
	relation2: relation;
}
