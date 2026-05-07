import { IsString } from "class-validator";

export class RedeemAccessCodeDto {
    @IsString()
    code: string;
}