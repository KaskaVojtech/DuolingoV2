/**
 * Student-side HTTP endpoints: courses, lesson content, completion, submitting results, vocabulary, practice and progress.
 */
import { Body, Controller, Get, Post, Delete, HttpCode, UseGuards, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserPortalService } from './user-portal.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserPortalController {
  constructor(private readonly userPortalService: UserPortalService) {}

  @Get('courses/:courseId/lessons')
  getCourseLessons(@Req() req: any, @Param('courseId') courseId: string) {
    return this.userPortalService.getCourseLessons(req.user.userId, courseId);
  }

  @Get('courses')
  getMyCourses(@Req() req: any) {
    return this.userPortalService.getMyCourses(req.user.userId);
  }

  @Post('courses/join')
  @HttpCode(200)
  joinCourse(@Req() req: any, @Body() body: { code: string }) {
    return this.userPortalService.joinCourse(req.user.userId, body.code);
  }

  @Post('lessons/:lessonId/complete')
  @HttpCode(204)
  completeLesson(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.userPortalService.completeLesson(req.user.userId, lessonId);
  }

  @Delete('lessons/:lessonId/complete')
  @HttpCode(204)
  uncompleteLesson(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.userPortalService.uncompleteLesson(req.user.userId, lessonId);
  }

  @Post('blocks/:blockId/complete')
  @HttpCode(204)
  completeBlock(@Req() req: any, @Param('blockId') blockId: string) {
    return this.userPortalService.completeBlock(req.user.userId, blockId);
  }

  @Delete('blocks/:blockId/complete')
  @HttpCode(204)
  uncompleteBlock(@Req() req: any, @Param('blockId') blockId: string) {
    return this.userPortalService.uncompleteBlock(req.user.userId, blockId);
  }

  @Get('lessons/:lessonId/content')
  getLessonContent(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.userPortalService.getLessonContent(req.user.userId, lessonId);
  }

  @Post('blocks/:blockId/submit')
  @HttpCode(200)
  submitActivity(
    @Req() req: any,
    @Param('blockId') blockId: string,
    @Body() body: { kind: 'exercise' | 'mix'; score: number; total: number; xp: number },
  ) {
    return this.userPortalService.submitActivity(req.user.userId, blockId, body);
  }

  @Get('lessons/:lessonId/vocabulary')
  getLessonVocabulary(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.userPortalService.getLessonVocabulary(req.user.userId, lessonId);
  }

  @Get('courses/:courseId/vocabulary')
  getCourseVocabulary(@Req() req: any, @Param('courseId') courseId: string) {
    return this.userPortalService.getCourseVocabulary(req.user.userId, courseId);
  }

  @Get('lessons/:lessonId/practice')
  getLessonPractice(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.userPortalService.getLessonPractice(req.user.userId, lessonId);
  }

  @Get('progress')
  getProgress(@Req() req: any) {
    return this.userPortalService.getProgress(req.user.userId);
  }
}
