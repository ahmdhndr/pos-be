/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorField {
  field: string;
  errors: string[];
}

interface ErrorResponse {
  status: 'success' | 'error' | 'failed';
  message: string;
  errors?: ErrorField[];
  data: null;
  stack?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { statusCode, body } = this.extractExceptionInfo(exception);
    const responseBody = this.buildResponseBody(statusCode, body);

    response.status(statusCode).json(responseBody);
  }

  private extractExceptionInfo(exception: unknown): {
    statusCode: HttpStatus;
    body: any;
  } {
    if (exception instanceof HttpException) {
      return {
        statusCode: exception.getStatus(),
        body: exception.getResponse(),
      };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        body: { message: exception.message },
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: { message: 'An error occurred' },
    };
  }

  private buildResponseBody(statusCode: HttpStatus, body: any): ErrorResponse {
    const statusText = this.getStatusText(statusCode);
    const message = this.extractMessage(body);
    const errors = this.extractErrors(body);
    const stack = this.getStackTrace();

    const response: ErrorResponse = {
      status: statusText,
      message,
      data: null,
      stack, // always include (even if undefined)
    };

    if (errors.length > 0) {
      response.errors = errors;
    }

    return response;
  }

  private getStatusText(statusCode: HttpStatus): 'error' | 'failed' {
    return statusCode >= HttpStatus.INTERNAL_SERVER_ERROR ? 'error' : 'failed';
  }

  private extractMessage(body: any): string {
    if (typeof body === 'string') {
      return body;
    }

    if (typeof body === 'object' && body !== null) {
      if (Array.isArray(body.message)) {
        return body.message.join(', ');
      }

      return body.message || 'An error occurred';
    }

    return 'An error occurred';
  }

  private extractErrors(body: any): ErrorField[] {
    if (
      body &&
      Array.isArray(body.errors) &&
      body.errors.length > 0 &&
      this.isErrorFieldArray(body.errors)
    ) {
      return body.errors;
    }

    return [];
  }

  private isErrorFieldArray(arr: any[]): arr is ErrorField[] {
    return arr.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.field === 'string' &&
        Array.isArray(item.errors),
    );
  }

  private getStackTrace(): string | undefined {
    if (process.env.NODE_ENV !== 'development') {
      return undefined;
    }

    return new Error().stack;
  }
}
