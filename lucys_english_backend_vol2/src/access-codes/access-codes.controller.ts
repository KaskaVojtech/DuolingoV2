import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AccessCodesService } from './access-codes.service';
import { CreateAccessCodeDto } from 'src/DTOs/access-codes/create-access-code.dto';
import { RedeemAccessCodeDto } from 'src/DTOs/access-codes/redeem-access-code';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Role } from '../authentication/decorators/role.decorator';
import { UserRole } from '../../generated/prisma';

@Controller('access-codes')
export class AccessCodesController {
    constructor(private readonly accessCodesService: AccessCodesService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.ADMIN)
    @Get()
    findAll() {
        return this.accessCodesService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.ADMIN)
    @Post()
    create(@Body() dto: CreateAccessCodeDto) {
        return this.accessCodesService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.accessCodesService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('redeem')
    redeem(@Body() dto: RedeemAccessCodeDto, @Request() req: any) {
        return this.accessCodesService.redeem(req.user.id, dto);
    }
}