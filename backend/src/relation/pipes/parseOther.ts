import { HttpException, HttpStatus, Injectable, PipeTransform, Req } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { getRepository, Repository } from "typeorm";
import { GetRelationDto } from "../dto/getRelationDto.dto";

@Injectable()
export class ParseOther implements PipeTransform {
    async transform(body: GetRelationDto): Promise<GetRelationDto> {

        const tmpOtherUser = await getRepository(User).findOne({ id_pseudo: body.id_pseudo })

       /* if (!tmpUser1)
            throw new HttpException(`Relation : PipeString : User ${body.id_pseudo1} does not exist`, HttpStatus.NOT_FOUND);
            */
        if (!tmpOtherUser)
            throw new HttpException(`Relation : PipeOther : User ${body.id_pseudo} does not exist`, HttpStatus.NOT_FOUND);

        const returnBody : GetRelationDto = {
            id_pseudo: tmpOtherUser.id_pseudo,
            otherUser : tmpOtherUser
        }

        return  returnBody
    }
}