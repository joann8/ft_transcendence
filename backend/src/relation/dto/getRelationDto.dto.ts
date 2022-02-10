import { IsOptional, IsString} from "class-validator";
import { User } from "src/user/entities/user.entity";

export class GetRelationDto {
    @IsString()
    id_pseudo: string;

    @IsOptional()
    otherUser: User
}
