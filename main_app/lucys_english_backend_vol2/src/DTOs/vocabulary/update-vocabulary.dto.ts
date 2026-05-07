import { IsOptional, IsString } from "class-validator";

export class UpdateVocabularyDto {
    @IsOptional()
    @IsString()
    czech?: string;

    @IsOptional()
    @IsString()
    english?: string;

    @IsOptional()
    @IsString()
    note?: string;
}