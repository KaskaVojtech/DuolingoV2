/**
 * Root application module; loads configuration, the PostgreSQL (TypeORM) and Redis connections and registers all domain modules.
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { PracticeModule } from './practice/practice.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { BlocksModule } from './blocks/blocks.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ContentEditorModule } from './content-editor/content-editor.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { MixEditorModule } from './mix-editor/mix-editor.module';
import { UploadsModule } from './uploads/uploads.module';
import { GroupsModule } from './groups/groups.module';
import { UserPortalModule } from './user-portal/user-portal.module';
import { AccessModule } from './access/access.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    RedisModule,
    PracticeModule,
    CoursesModule,
    LessonsModule,
    BlocksModule,
    ExercisesModule,
    ContentEditorModule,
    VocabularyModule,
    MixEditorModule,
    UploadsModule,
    GroupsModule,
    UserPortalModule,
    AccessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
