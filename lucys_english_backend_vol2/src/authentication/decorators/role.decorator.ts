import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'generated/prisma';

export const Role = (role: UserRole) => SetMetadata('role', role);