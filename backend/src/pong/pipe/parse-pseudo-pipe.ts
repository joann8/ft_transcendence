import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { getRepository } from "typeorm";

@Injectable()
export class ParsePseudoPipe implements PipeTransform<string, Promise<User>> {
    async transform(value: string): Promise<User> {
        const user = await getRepository(User).findOne(
            { where: { id_pseudo: value } });
        if (!user)
            throw new BadRequestException(`User ${value} does not exist`);
        else
            return user;
    }
}