import { Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";
import { IRegisterStrategy } from "../interfaces/IRegisterStrategy";
import { User } from "generated/client";
import { randomBytes } from "crypto";

@Injectable()
export class AccessCodeRegisterStrategy implements IRegisterStrategy<void> {
  constructor(private readonly usersService: UsersService) {}

  async register(): Promise<User> {
    const code = randomBytes(6).toString('hex'); 
    return this.usersService.create({
      accessCode: code,
      displayName: 'User',
    });
  }
}