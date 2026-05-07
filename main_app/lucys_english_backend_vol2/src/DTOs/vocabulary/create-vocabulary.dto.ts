import { IsOptional, IsString } from "class-validator";

export class CreateVocabularyDto {
    @IsString()
    czech: string;

    @IsString()
    english: string;

    @IsOptional()
    @IsString()
    note?: string;
}