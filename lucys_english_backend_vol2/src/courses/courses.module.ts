import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PostgresModule } from 'src/postgres/postgres.module';
import { RolesGuard } from 'src/authentication/guards/roles.guard';

@Module({
    imports: [PostgresModule],
    providers: [CoursesService, RolesGuard],
    controllers: [CoursesController],
})
export class CoursesModule { }