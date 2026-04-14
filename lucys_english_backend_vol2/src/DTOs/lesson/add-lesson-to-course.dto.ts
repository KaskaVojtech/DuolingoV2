import { IsNumber, isNumber } from "class-validator";

export class AddLessonToCourseDto {

    @IsNumber()
    order: number;
}