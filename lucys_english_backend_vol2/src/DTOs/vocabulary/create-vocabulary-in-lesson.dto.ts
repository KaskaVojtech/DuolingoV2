import { IsOptional, IsString } from "class-validator";

export class CreateVocabularyInLessonDto {
    @IsString()
    czech: string;
    @IsString()
    english: string;
    @IsOptional()
    @IsString()
    note?: string;
}