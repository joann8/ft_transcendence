import { IsNumber } from "class-validator"

export class ResultDto {
    @IsNumber()
    win : Number

    @IsNumber()
    lost : Number
}

