import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class GreetingDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the person',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'fullName must be a string' })
  @MinLength(1, { message: 'fullName is required' })
  @MaxLength(100, { message: 'fullName must not exceed 100 characters' })
  fullName: string;
}
