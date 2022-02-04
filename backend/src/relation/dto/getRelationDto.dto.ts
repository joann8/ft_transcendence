import { IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import { User, user_role } from "src/user/entities/user.entity";


export class GetRelationDto {
    @IsString()
    id_pseudo: string;

    @IsOptional()
    otherUser: User
}
