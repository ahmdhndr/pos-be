import { Test, TestingModule } from '@nestjs/testing';

import { BaseService } from './base.service';

describe('BaseService', () => {
  let service: BaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseService],
    }).compile();

    service = module.get<BaseService>(BaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return welcome message', () => {
    const result = service.getHello();
    expect(result).toBe('Welcome to NestJS starter template 🚀');
  });

  it('should return greeting with name', () => {
    const result = service.greeting({ fullName: 'John' });
    expect(result).toBe('Hello John');
  });

  it('should throw BadRequestException on getError', () => {
    expect(() => service.getError()).toThrow();
  });
});
