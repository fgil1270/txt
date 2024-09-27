import { Controller, Get, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file' , {
    storage: diskStorage({
      //destination: './uploads/txt', // Directorio donde se guardarán los archivos
      filename: (req, file, cb) => {
         
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);  
      },
    }),
    
  } ))
  async getHello(@UploadedFile() file: Express.Multer.File, @Res() res: Response){
    
    const filePath = file.path; // Asegúrate de que el archivo se guarda en el sistema de archivos
    try {
      const outPutFilePath = await this.appService.getHello(filePath);
      //res.status(200).json({ message: 'File processed successfully', filePath: outPutFilePath });
      
      const fileStream = createReadStream(outPutFilePath, 'ascii'); 
      res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${path.basename(outPutFilePath)}"`
      });
      fileStream.pipe(res); 
      return fileStream;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error processing file' });
    }
    
  }
}
