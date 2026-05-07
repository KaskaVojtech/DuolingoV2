import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateVocabularyDto } from "src/DTOs/vocabulary/create-vocabulary.dto";
import { QueryVocabularyDto } from "src/DTOs/vocabulary/query-vocabulary.dto";
import { UpdateVocabularyDto } from "src/DTOs/vocabulary/update-vocabulary.dto";
import { PostgresService } from "src/postgres/postgres.service";

@Injectable()
export class VocabularyService {
    constructor(private readonly postgres: PostgresService) { }

    async findAll(query: QueryVocabularyDto) {
        const { search, lessonId } = query;

        return this.postgres.vocabulary.findMany({
            where: {
                ...(search && {
                    OR: [
                        { czech: { contains: search, mode: 'insensitive' } },
                        { english: { contains: search, mode: 'insensitive' } },
                    ],
                }),
                ...(lessonId && {
                    lessonVocabulary: {
                        some: { lessonId: Number(lessonId) },
                    },
                }),
            },
            include: {
                lessonVocabulary: {
                    include: { lesson: true },
                },
            },
        });
    }

    async findOne(id: number) {
        const vocabulary = await this.postgres.vocabulary.findUnique({ where: { id } });
        if (!vocabulary) throw new NotFoundException('Vocabulary not found');
        return vocabulary;
    }

    async create(dto: CreateVocabularyDto) {
        return this.postgres.vocabulary.create({ data: dto });
    }

    async update(id: number, dto: UpdateVocabularyDto) {
        await this.findOne(id);
        return this.postgres.vocabulary.update({ where: { id }, data: dto });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.postgres.vocabulary.delete({ where: { id } });
    }
}