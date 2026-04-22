import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseDto {
  @ApiProperty({
    description: 'Response data',
    example: 'Welcome to NestJS starter template 🚀',
  })
  @Expose()
  data: string;
}
