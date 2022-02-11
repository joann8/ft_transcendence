import { IsOptional} from "class-validator";
import { User } from "src/user/entities/user.entity";
import { relation } from "../entities/relation.entity";

export class FriendDto {
    @IsOptional()
    user: User

    @IsOptional()
    relation: relation
}