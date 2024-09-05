import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

@Post()
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file:Express.Multer.File){
    this.uploadService.upload(file.originalname,file.buffer);
}

}
