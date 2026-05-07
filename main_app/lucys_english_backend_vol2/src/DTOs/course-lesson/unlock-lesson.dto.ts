import { IsBoolean } from "class-validator";

export class UnlockLessonDto {
    @IsBoolean()
    isUnlocked: boolean;
}