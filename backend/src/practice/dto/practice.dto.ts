import { IsBoolean, IsString } from 'class-validator';

export class UpdatePracticeConfigDto {
  @IsBoolean()
  isPracticeEnabled?: boolean;
}

export class UpdatePracticeTypeDto {
  @IsBoolean()
  isEnabled: boolean;
}
