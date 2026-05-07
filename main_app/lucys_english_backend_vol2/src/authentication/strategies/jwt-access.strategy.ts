import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.['access_token'],
            ]),
            secretOrKey: process.env.JWT_ACCESS_SECRET!,
        });
    }

    async validate(payload: { sub: number; email: string; role: string }) {
        return { id: payload.sub, email: payload.email, role: payload.role };
    }
}