import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryLessonDto {
    @IsOptional()
    @IsString()
    search?: string;
    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsNumber()
    courseId?: number;
}