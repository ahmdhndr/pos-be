import { Test, TestingModule } from '@nestjs/testing';

import { BaseController } from './base.controller';
import { BaseService } from './base.service';

describe('BaseController', () => {
  let controller: BaseController;
  let service: BaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseController],
      providers: [BaseService],
    }).compile();

    controller = module.get<BaseController>(BaseController);
    service = module.get<BaseService>(BaseService);
  });

  describe('getHello', () => {
    it('should return a welcome message', () => {
      const result = 'Welcome to NestJS starter template 🚀';
      jest.spyOn(service, 'getHello').mockReturnValue(result);

      expect(controller.getHello()).toBe(result);
    });
  });

  describe('greeting', () => {
    it('should return a greeting with full name', () => {
      const greetingDto = { fullName: 'John Doe' };
      const result = 'Hello John Doe';
      jest.spyOn(service, 'greeting').mockReturnValue(result);

      expect(controller.greeting(greetingDto)).toBe(result);
    });
  });

  describe('getError', () => {
    it('should throw BadRequestException', () => {
      expect(() => controller.getError()).toThrow();
    });
  });

  describe('getInternalError', () => {
    it('should throw InternalServerErrorException', () => {
      expect(() => controller.getInternalError()).toThrow();
    });
  });
});
