import { IsEmail, IsString, MinLength } from 'class-validator';
import { VALIDATION } from 'src/validators/validation.constants';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(VALIDATION.PASSWORD_MIN_LENGTH)
  password: string;
}