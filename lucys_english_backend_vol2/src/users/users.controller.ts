import { Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "generated/prisma";
import { Role } from "src/authentication/decorators/role.decorator";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { RolesGuard } from "src/authentication/guards/roles.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Role(UserRole.ADMIN)
@Controller('lessons')
export class UsersController {
    usersService: any;
    constructor() { }


}