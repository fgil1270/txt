import { Module } from '@nestjs/common';
import { ChecadorController } from './checador.controller';
import { ChecadorService } from './checador.service';

@Module({
  imports: [],
  controllers: [ChecadorController],
  providers: [ChecadorService],
  exports: []
})
export class ChecadorModule { }
