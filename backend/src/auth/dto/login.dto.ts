import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Neplatný email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Heslo je povinné' })
  password: string;
}
