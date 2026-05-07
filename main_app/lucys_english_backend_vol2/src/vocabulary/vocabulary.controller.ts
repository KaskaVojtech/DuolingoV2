import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateVocabularyDto } from "src/DTOs/vocabulary/create-vocabulary.dto";
import { UpdateVocabularyDto } from "src/DTOs/vocabulary/update-vocabulary.dto";
import { VocabularyService } from "./vocabulary.service";
import { JwtAuthGuard } from "src/authentication/guards/jwt-auth.guard";
import { Role } from "src/authentication/decorators/role.decorator";
import { RolesGuard } from "src/authentication/guards/roles.guard";
import { UserRole } from "generated/prisma";
import { QueryVocabularyDto } from "src/DTOs/vocabulary/query-vocabulary.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Role(UserRole.ADMIN)
@Controller('vocabulary')
export class VocabularyController {
    constructor(private readonly vocabularyService: VocabularyService) { }

    @Get()
    findAll(@Query() query: QueryVocabularyDto) {
        return this.vocabularyService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.vocabularyService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateVocabularyDto) {
        return this.vocabularyService.create(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVocabularyDto) {
        return this.vocabularyService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.vocabularyService.remove(id);
    }
}