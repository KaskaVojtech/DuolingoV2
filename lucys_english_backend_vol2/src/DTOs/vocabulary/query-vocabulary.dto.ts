import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryVocabularyDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsNumber()
    lessonId?: number;
}