import { IsNumber } from "class-validator";

export class UpdateLessonOrderDto {
    @IsNumber()
    order: number;
}