import { User } from "generated/client";
import { IRegisterStrategy } from "../interfaces/IRegisterStrategy";
import { UsersService } from "../users.service";
import { RegisterEmailPasswordDto } from "../dtos/register-email-password-dto";
import { ConflictException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailPasswordRegisterStrategy implements IRegisterStrategy<RegisterEmailPasswordDto> {
 
  constructor(private readonly usersService: UsersService) {}

  async register(credentials: RegisterEmailPasswordDto): Promise<User> {
      const existing = await this.usersService.findByEmail(credentials.email);
      if (existing) throw new ConflictException('Email already in use');

      const passwordHash = await bcrypt.hash(credentials.password, 10);
      return this.usersService.create({
        email: credentials.email,
        passwordHash,
        displayName: credentials.email.split('@')[0],
      });
    }
  }