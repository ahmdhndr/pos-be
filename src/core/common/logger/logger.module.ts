import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'pino-nestjs';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
      forRoutes: [{ method: RequestMethod.ALL, path: '*splat' }],
    }),
  ],
})
export class LoggerModule {}
