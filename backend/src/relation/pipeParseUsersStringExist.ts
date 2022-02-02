import { HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { getRepository, Repository } from "typeorm";
import { GetRelationDto } from "./dto/getRelationDto.dto";
import { FindRelationDto } from "./dto/findRelationdto";

@Injectable()
export class ParseUsersStringExist implements PipeTransform {
    async transform(body: GetRelationDto): Promise<GetRelationDto> {

        const tmpUser1 = await getRepository(User).findOne({ id_pseudo: body.id_pseudo1 })
        const tmpUser2 = await getRepository(User).findOne({ id_pseudo: body.id_pseudo2 })

        if (!tmpUser1)
            throw new HttpException(`Relation : PipeString : User ${body.id_pseudo1} does not exist`, HttpStatus.NOT_FOUND);
        if (!tmpUser2)
            throw new HttpException(`Relation : PipeString : User ${body.id_pseudo2} does not exist`, HttpStatus.NOT_FOUND);

        const returnBody : GetRelationDto = {
            id_pseudo1: tmpUser1.id_pseudo,
            id_pseudo2: tmpUser2.id_pseudo,
            user1 : tmpUser1,
            user2 : tmpUser2
        }

        return  returnBody
    }
}