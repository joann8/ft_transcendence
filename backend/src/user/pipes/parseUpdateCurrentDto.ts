import { Body, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { getRepository, Repository } from "typeorm";
import { UpdateCurrentUserDto } from "../dto/updateCurrentUser.dto";

@Injectable()
export class ParseUpdateCurrentDto implements PipeTransform {

    async transform(body: UpdateCurrentUserDto) {

        //Before update check for DUPLICATES
        if (body.id_pseudo) {
            const duplicate = await getRepository(User).findOne({id_pseudo: body.id_pseudo})
            if (duplicate)
                throw new HttpException("Pseudo is not available", HttpStatus.CONFLICT)
        }
        return body
    }
}