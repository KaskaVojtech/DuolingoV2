import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { User } from "generated/client";
import { AccessCodeDto } from "../dtos/access-code-dto";
import { IAuthStrategy } from "../interfaces/IAuthStrategy";

@Injectable()
export class AccessCodeStrategy implements IAuthStrategy<AccessCodeDto> {
  constructor(
    private readonly userService: UsersService,
  ) {}

  async authenticate(credentials: AccessCodeDto): Promise<User> {
    const user = await this.userService.findByAccessCode(credentials.code);
    
    if (!user) throw new UnauthorizedException('Invalid or expired code');
    
    return user;
  }
}