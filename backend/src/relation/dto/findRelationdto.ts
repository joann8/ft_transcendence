import { IsNumber, IsOptional, IsString} from "class-validator";
import { User } from "src/user/entities/user.entity";


export class FindRelationDto {
    @IsNumber()
    userId1: number;

    @IsNumber()
    userId2: number;
}
