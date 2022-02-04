import { HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { getRepository, Repository } from "typeorm";
import { RelationDto } from "./dto/relation.dto";

@Injectable()
export class ParseUpdate implements PipeTransform {

    async transform(body: RelationDto): Promise<RelationDto> {

        const tmpUser2 = await getRepository(User).findOne({ id_pseudo: body.id_pseudo2 })

        if (!tmpUser2)
            throw new HttpException(`Relation : PipeUpdate : User ${body.id_pseudo2} does not exist`, HttpStatus.NOT_FOUND);

        const returnBody: RelationDto = {
            id_pseudo1: null,
            id_pseudo2: tmpUser2.id_pseudo,
            userId1: null,
            userId2: tmpUser2.id,
            userId1bis: null,
            userId2bis: tmpUser2.id,
            relation1: body.relation1,
            relation2: body.relation2,
        }
        return returnBody
    }
}