import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file' , {
    storage: diskStorage({
      //destination: './uploads/txt', // Directorio donde se guardarán los archivos
      filename: (req, file, cb) => {
        console.log(file)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  } ))
  async getHello(@UploadedFile() file: Express.Multer.File): Promise<any> {
    const filePath = file.path; // Asegúrate de que el archivo se guarda en el sistema de archivos
    return this.appService.getHello(filePath);
  }
}
