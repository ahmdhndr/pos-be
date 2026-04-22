import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { AllExceptionsFilter } from './http-exception.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;
  });

  describe('HttpException handling', () => {
    it('should handle HttpException with string message', () => {
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'failed',
          message: 'Forbidden',
          data: null,
        }),
      );
    });

    it('should handle HttpException with object message', () => {
      const exception = new HttpException(
        { message: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'failed',
          message: 'Bad Request',
          data: null,
        }),
      );
    });

    it('should handle BadRequestException with validation errors', () => {
      const errors = [
        { field: 'email', errors: ['email is required'] },
        {
          field: 'password',
          errors: ['password must be at least 8 characters'],
        },
      ];

      const exception = new BadRequestException({
        message: 'Validation failed',
        errors,
      });

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'failed',
          message: 'Validation failed',
          errors,
          data: null,
        }),
      );
    });

    it('should return server error status text for 5xx codes', () => {
      const exception = new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
        }),
      );
    });

    it('should return failed status text for 4xx codes', () => {
      const exception = new BadRequestException('Bad Request');

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'failed',
        }),
      );
    });
  });

  describe('Error handling', () => {
    it('should handle standard Error with message', () => {
      const exception = new Error('Unexpected error');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Unexpected error',
          data: null,
        }),
      );
    });

    it('should handle unknown exception type', () => {
      const exception = 'Unknown error string';

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'An error occurred',
          data: null,
        }),
      );
    });

    it('should handle null exception', () => {
      const exception = null;

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'An error occurred',
          data: null,
        }),
      );
    });
  });

  describe('Stack trace handling', () => {
    let originalEnv: string | undefined;

    beforeEach(() => {
      originalEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should include stack trace in development', () => {
      process.env.NODE_ENV = 'development';
      const exception = new Error('Development error');

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: expect.any(String),
        }),
      );
    });

    it('should not include stack trace in production', () => {
      process.env.NODE_ENV = 'production';
      const exception = new Error('Production error');

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: undefined,
        }),
      );
    });

    it('should not include stack trace in test environment', () => {
      process.env.NODE_ENV = 'test';
      const exception = new Error('Test error');

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: undefined,
        }),
      );
    });
  });

  describe('Error response structure', () => {
    it('should always include status, message, and data fields', () => {
      const exception = new Error('Test error');

      filter.catch(exception, mockHost);

      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs).toHaveProperty('status');
      expect(callArgs).toHaveProperty('message');
      expect(callArgs).toHaveProperty('data');
      expect(callArgs.data).toBeNull();
    });

    it('should not include errors field if there are no validation errors', () => {
      const exception = new BadRequestException('Bad Request');

      filter.catch(exception, mockHost);

      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('errors');
    });

    it('should include errors field if validation errors are present', () => {
      const errors = [{ field: 'email', errors: ['email is required'] }];
      const exception = new BadRequestException({
        message: 'Validation failed',
        errors,
      });

      filter.catch(exception, mockHost);

      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs).toHaveProperty('errors');
      expect(callArgs.errors).toEqual(errors);
    });
  });

  describe('Message extraction', () => {
    it('should extract message from string exception', () => {
      const exception = new HttpException(
        'String message',
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'String message',
        }),
      );
    });

    it('should extract message from object exception', () => {
      const exception = new HttpException(
        { message: 'Object message', extra: 'field' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Object message',
        }),
      );
    });

    it('should use default message if object has no message property', () => {
      const exception = new HttpException({}, HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'An error occurred',
        }),
      );
    });
  });
});
