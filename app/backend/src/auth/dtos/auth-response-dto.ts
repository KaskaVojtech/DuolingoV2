import { IsString } from 'class-validator';

export class AuthResponseDTO {

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}