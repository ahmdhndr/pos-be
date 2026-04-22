import { SuccessResponseMessage } from '@core/decorators/success-response-message.decorator';
import { Serialize } from '@core/interceptors/serialize.interceptor';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseService } from './base.service';
import { GreetingDto } from './dto/greeting.dto';
import { ResponseDto } from './dto/response.dto';

@ApiTags('Base')
@Serialize(ResponseDto)
@Controller()
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Get()
  @SuccessResponseMessage('Success response!')
  @ApiOperation({
    summary: 'Get greeting message',
    description: 'Returns a welcome message',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved greeting',
    type: ResponseDto,
  })
  getHello() {
    return this.baseService.getHello();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send greeting',
    description: 'Creates and returns a personalized greeting',
  })
  @ApiBody({
    type: GreetingDto,
    description: 'Greeting request with full name',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully created greeting',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
  })
  greeting(
    @Body(new ValidationPipe({ transform: true }))
    greetingDto: GreetingDto,
  ) {
    return this.baseService.greeting(greetingDto);
  }

  @Get('error')
  @ApiOperation({
    summary: 'Get error',
    description: 'Returns a bad request error',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request error',
  })
  getError() {
    return this.baseService.getError();
  }

  @Get('internal-error')
  @ApiOperation({
    summary: 'Get internal error',
    description: 'Returns an internal server error',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getInternalError() {
    throw new InternalServerErrorException('Internal server error');
  }
}
