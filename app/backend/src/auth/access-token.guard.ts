import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Request } from "express";
import type { IAccessTokenService } from "./interfaces/ITokenService";

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        @Inject('IAccessTokenService') private readonly accessTokenService: IAccessTokenService,
    ) {}

    // ============================================
    // MAIN METHODS
    // ============================================

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractToken(request);
        
        if (!token) throw new UnauthorizedException('No token provided');
        
        const isValid = await this.accessTokenService.verifyAccessToken(token);
        if (!isValid) throw new UnauthorizedException('Invalid or expired token');

        const userId = await this.accessTokenService.getIdFromAccessToken(token);
        request['userId'] = userId;
        
        return true;
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private extractToken(request: Request): string | null {
        const auth = request.headers.authorization;
        if (!auth || !auth.startsWith('Bearer ')) return null;
        return auth.split(' ')[1];
    }
}