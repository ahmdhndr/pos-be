import { ApiProperty } from '@nestjs/swagger';

export class ErrorFieldDto {
  @ApiProperty({
    example: 'fullName',
    description: 'Field name that failed validation',
  })
  field: string;

  @ApiProperty({
    example: ['fullName is required'],
    description: 'List of validation errors',
    isArray: true,
  })
  errors: string[];
}

export class ErrorResponseDto {
  @ApiProperty({
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    type: [ErrorFieldDto],
    description: 'Array of field errors',
  })
  errors: ErrorFieldDto[];
}
