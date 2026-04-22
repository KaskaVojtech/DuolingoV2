import { IsOptional, IsNumber, IsString } from "class-validator";


export class CreateAccessCodeDto {
    @IsOptional()
    @IsString()
    code?: string;
    @IsOptional()
    @IsString()
    expiresAt?: string;
    @IsNumber()
    courseIds: number[];
}