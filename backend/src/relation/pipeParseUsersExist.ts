import { HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { getRepository } from "typeorm";
import { RelationDto } from "./dto/relation.dto";

@Injectable()
export class PipeParseUsersExist implements PipeTransform {
    async transform(relationRequest: RelationDto): Promise<RelationDto> {

        //Verifie que les deux users existe dans la table USER
        const user1 = await getRepository(User).findOne(relationRequest.user1.id_pseudo)
        const user2 = await getRepository(User).findOne(relationRequest.user2.id_pseudo)
        if (!user1)
            throw new HttpException(`User ${user1.id_pseudo} does not exist`, HttpStatus.NOT_FOUND);
        if (!user2)
            throw new HttpException(`User ${user2.id_pseudo} does not exist`, HttpStatus.NOT_FOUND);
        return relationRequest
    }
}