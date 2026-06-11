/**
 * HTTP endpoints for managing access codes.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AccessService } from './access.service';

@Controller('access')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get('codes')
  listCodes(@Query() query: any) {
    return this.accessService.listCodes(query);
  }

  @Post('codes')
  generateCodes(@Body() body: any) {
    return this.accessService.generateCodes(
      body.courseId,
      body.groupId ?? null,
      body.count ?? 1,
      body.validFrom ?? null,
      body.validUntil ?? null,
    );
  }

  @Delete('codes/:id')
  @HttpCode(204)
  revokeCode(@Param('id') id: string) {
    return this.accessService.revokeCode(id);
  }

  @Get('users')
  listUserGrants(@Query() query: any) {
    return this.accessService.listUserGrants(query);
  }

  @Post('users')
  grantUser(@Body() body: { email: string; courseId: string }) {
    return this.accessService.grantUser(body.email, body.courseId);
  }

  @Delete('users/:id')
  @HttpCode(204)
  revokeUserGrant(@Param('id') id: string) {
    return this.accessService.revokeUserGrant(id);
  }
}
