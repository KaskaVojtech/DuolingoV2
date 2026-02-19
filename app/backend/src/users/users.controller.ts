import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client'; 
import { UsersService } from './users.service';

class RegisterDto {
  email: string;
  password: string;
  displayName: string;
}

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

// ============================================
// POST
// ============================================

    @Post('register/email')
    @HttpCode(201) 
    async registerWithEmail(@Body() RegisterDto: RegisterDto){
        const user = await this.usersService.registerWithEmail(RegisterDto.password, RegisterDto.displayName, RegisterDto.email)
        return { id: user.id, email: user.email, displayName: user.displayName };
    }

}
