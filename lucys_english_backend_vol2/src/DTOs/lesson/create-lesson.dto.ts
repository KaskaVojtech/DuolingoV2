import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLessonDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

}