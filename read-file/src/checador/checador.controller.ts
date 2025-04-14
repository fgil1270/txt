import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ChecadorService } from './checador.service';

@Controller('checador')
export class ChecadorController {
  constructor(private readonly checadorService: ChecadorService) {}

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.checadorService.findAll();
      
      /* res.setHeader('Content-Type', 'image/jpeg');
      res.send(data); */
      
      if(data){
        
        /* const hexString = data.toString('hex');
        const buffer = Buffer.from(hexString, 'hex'); */
        //const base64Image = data.toString('base64');
        
        return res.json(data)
      }else{
        res.status(404).send('Imagen no encontrada');
      }
      
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to get data');
    }
  }

}
