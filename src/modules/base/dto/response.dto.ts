import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseDto {
  @ApiProperty({
    description: 'Response data',
    example: 'Welcome to POS System Multi Tenant',
  })
  @Expose()
  data: string;
}
