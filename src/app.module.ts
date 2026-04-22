import { LoggerModule } from '@core/common';
import { ConfigModule } from '@core/config';
import { BaseModule } from '@modules/base';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule, LoggerModule, BaseModule],
})
export class AppModule {}
