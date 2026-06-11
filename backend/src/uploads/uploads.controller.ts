/**
 * HTTP endpoints for uploading media (course thumbnails, word images, pronunciation, content) to disk; returns relative URLs.
 */
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import * as path from 'path';
import * as fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
    cb(null, uniqueName);
  },
});

@Controller('uploads')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UploadsController {
  @Post('course-thumbnail')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadCourseThumbnail(@UploadedFile() file: any) {
    return { url: `/uploads/${file.filename}` };
  }

  @Post('pronunciation')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadPronunciation(@UploadedFile() file: any) {
    return { url: `/uploads/${file.filename}` };
  }

  @Post('word-image')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadWordImage(@UploadedFile() file: any) {
    return { url: `/uploads/${file.filename}` };
  }

  @Post('media')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadMedia(@UploadedFile() file: any) {
    return { url: `/uploads/${file.filename}` };
  }
}
