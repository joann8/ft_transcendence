import { IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import { User, user_role } from "src/user/entities/user.entity";


export class GetRelationDto {
    @IsString()
    id_pseudo1: string;

    @IsString()
    id_pseudo2: string;

    @IsOptional()
    user1: User

    @IsOptional()
    user2: User
}
