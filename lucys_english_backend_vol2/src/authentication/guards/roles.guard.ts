import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'generated/prisma';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        console.log('=== RolesGuard START ===');
        const requiredRole = this.reflector.getAllAndOverride<UserRole>('role', [
            context.getHandler(),
            context.getClass(),
        ]);

        console.log('requiredRole:', requiredRole);

        if (!requiredRole) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log('user.role:', user?.role, typeof user?.role);
        console.log('match:', user?.role === requiredRole);

        console.log('user:', user);

        if (user?.role !== requiredRole) {
            throw new ForbiddenException('Access denied');
        }

        return true;
    }
}