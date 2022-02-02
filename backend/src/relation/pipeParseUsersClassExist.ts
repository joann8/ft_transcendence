import { HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { getRepository, Repository } from "typeorm";
import { RelationDto } from "./dto/relation.dto";

@Injectable()
export class ParseUsersClassExist implements PipeTransform {

    async transform(body: RelationDto): Promise<RelationDto> {

        const tmpUser1 = await getRepository(User).findOne({ id_pseudo: body.id_pseudo1 })
        const tmpUser2 = await getRepository(User).findOne({ id_pseudo: body.id_pseudo2 })

        if (!tmpUser1)
            throw new HttpException(`Relation : PipeClass : User ${body.id_pseudo1} does not exist`, HttpStatus.NOT_FOUND);
        if (!tmpUser2)
            throw new HttpException(`Relation : PipeClass : User ${body.id_pseudo2} does not exist`, HttpStatus.NOT_FOUND);

        const returnBody: RelationDto = {
            id_pseudo1: tmpUser1.id_pseudo,
            id_pseudo2: tmpUser2.id_pseudo,
            userId1: tmpUser1.id,
            userId2: tmpUser2.id,
            userId1bis : tmpUser1.id,
            userId2bis: tmpUser2.id,
            relation1: body.relation1,
            relation2: body.relation2,
        }
        return returnBody
    }
}