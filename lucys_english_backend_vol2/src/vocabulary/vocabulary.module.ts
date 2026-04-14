import { PostgresModule } from "src/postgres/postgres.module";
import { VocabularyService } from "./vocabulary.service";
import { VocabularyController } from "./vocabulary.controller";
import { Module } from "@nestjs/common";
import { RolesGuard } from "src/authentication/guards/roles.guard";

@Module({
    imports: [PostgresModule],
    providers: [VocabularyService, RolesGuard],
    controllers: [VocabularyController],
})
export class VocabularyModule { }