import { IsString } from 'class-validator';

export class AccessCodeDto {
  
  @IsString()
  code: string;
}