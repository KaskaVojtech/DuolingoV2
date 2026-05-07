import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class SetCacheDto {
    @IsString()
    value: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(86400)          // max 24 hodin
    ttl?: number;
}