import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupModule } from './crons/cleanup/cleanup.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { AccessCodesModule } from './access-codes/access-codes.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot(),
    CleanupModule,
    CoursesModule,
    LessonsModule,
    VocabularyModule,
    AccessCodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
