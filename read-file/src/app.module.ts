import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      //envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      //load: [config],
      isGlobal: true,
      /* expandVariables: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MYSQL_DATABASE: Joi.string().required(),
        MYSQL_PORT: Joi.number().required(),
      }), */
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
