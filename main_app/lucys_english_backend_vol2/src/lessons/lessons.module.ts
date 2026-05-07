import { PostgresModule } from "src/postgres/postgres.module";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { Module } from "@nestjs/common";
import { RolesGuard } from "src/authentication/guards/roles.guard";

@Module({
    imports: [PostgresModule],
    providers: [LessonsService, RolesGuard],
    controllers: [LessonsController],
})
export class LessonsModule { }