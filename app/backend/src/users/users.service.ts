import { Injectable, ConflictException } from '@nestjs/common';
import { PostgresService } from 'src/postgres/postgres.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly postgresService: PostgresService){}

    async create(data: { email?: string; passwordHash?: string; accessCode?: string; displayName: string }) {
        return this.postgresService.user.create({
            data: {
            ...data,
            isActive: true,
            },
        });
    }

    async findByEmail(email: string){
        return this.postgresService.user.findUnique({
            where: {
                email,
            }
        })
    }

    async findByAccessCode(accessCode : string){
            return this.postgresService.user.findUnique({
            where: {
                accessCode,
            }
        })
    }
    

    async registerWithEmail(password: string, displayName: string, email: string){
    
        const existing = await this.postgresService.user.findUnique({ 
            where: {
                    email 
                } 
        });
        if (existing) throw new ConflictException('Email already exists');
        

        const passwordHash = await bcrypt.hash(password, 16);

        return this.postgresService.user.create({
        data: {
        email,
        displayName,
        passwordHash,
        status: 'pending', 
        isActive: true,
      },
    });
  }

    }
    

