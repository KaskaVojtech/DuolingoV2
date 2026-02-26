import { Injectable, UnauthorizedException } from "@nestjs/common";
import {IAuthStrategy } from "../interfaces/IAuthStrategy";
import { UsersService } from "src/users/users.service";
import { User } from "generated/client";
import * as bcrypt from 'bcrypt';
import { EmailPasswordDto } from "../dtos/email-password-dto";

@Injectable()
export class EmailPasswordStrategy implements IAuthStrategy<EmailPasswordDto> {
  constructor(
    private readonly userService: UsersService,
  ) {}

  async authenticate(credentials: EmailPasswordDto): Promise<User> {
    const user = await this.userService.findByEmail(credentials.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
    
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    
    return user;
  }
}