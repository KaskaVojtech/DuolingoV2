import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateLessonDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

}