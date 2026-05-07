import { IsEmail, IsString, MinLength, Validate } from "class-validator";
import { Match } from "../../validators/match.validator";
import { VALIDATION } from "src/validators/validation.constants";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(VALIDATION.PASSWORD_MIN_LENGTH)
    password: string;

    @Validate(Match, ['password'])
    confirmPassword: string;
}