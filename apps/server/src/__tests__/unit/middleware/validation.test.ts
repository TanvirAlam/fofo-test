// Mock class-validator and class-transformer first
const mockValidate = jest.fn();
const mockPlainToInstance = jest.fn();

jest.mock('class-validator', () => ({
  validate: (...args: any[]) => mockValidate(...args),
  IsEmail: jest.fn(() => () => {}),
  IsString: jest.fn(() => () => {}),
  Length: jest.fn(() => () => {}),
  ValidationError: jest.fn(),
}));

jest.mock('class-transformer', () => ({
  plainToInstance: (...args: any[]) => mockPlainToInstance(...args),
}));

import { validateRequest } from '../../../middleware/validation';
import { IsEmail, IsString, Length } from 'class-validator';

// Test DTO class
class TestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(3, 50)
  name!: string;
}

describe('Validation Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
      validatedData: undefined,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('validateRequest', () => {
    it('should validate request body and call next on success', async () => {
      const validData = { email: 'test@example.com', name: 'John Doe' };
      const transformedData = new TestDto();
      Object.assign(transformedData, validData);

      mockReq.body = validData;
      mockPlainToInstance.mockReturnValue(transformedData);
      mockValidate.mockResolvedValue([]); // No validation errors

      const middleware = validateRequest(TestDto);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockPlainToInstance).toHaveBeenCalledWith(TestDto, validData);
      expect(mockValidate).toHaveBeenCalledWith(transformedData, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      expect(mockReq.validatedData).toEqual(transformedData);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return validation errors and not call next on failure', async () => {
      const invalidData = { email: 'invalid-email', name: '' };
      const transformedData = new TestDto();
      Object.assign(transformedData, invalidData);

      const validationErrors = [
        {
          property: 'email',
          constraints: { isEmail: 'email must be an email' },
          value: 'invalid-email',
        },
        {
          property: 'name',
          constraints: {
            length: 'name must be longer than or equal to 3 characters',
          },
          value: '',
        },
      ];

      mockReq.body = invalidData;
      mockPlainToInstance.mockReturnValue(transformedData);
      mockValidate.mockResolvedValue(validationErrors);

      const middleware = validateRequest(TestDto);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            property: 'email',
            constraints: { isEmail: 'email must be an email' },
          },
          {
            property: 'name',
            constraints: {
              length: 'name must be longer than or equal to 3 characters',
            },
          },
        ],
      });
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockReq.validatedData).toBeUndefined();
    });

    it('should handle empty request body', async () => {
      const transformedData = new TestDto();

      mockReq.body = {};
      mockPlainToInstance.mockReturnValue(transformedData);
      mockValidate.mockResolvedValue([]); // No validation errors

      const middleware = validateRequest(TestDto);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockPlainToInstance).toHaveBeenCalledWith(TestDto, {});
      expect(mockValidate).toHaveBeenCalledWith(transformedData, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      expect(mockReq.validatedData).toEqual(transformedData);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle single validation error', async () => {
      const invalidData = { email: 'test@example.com', name: 'ab' }; // name too short
      const transformedData = new TestDto();
      Object.assign(transformedData, invalidData);

      const validationErrors = [
        {
          property: 'name',
          constraints: {
            length: 'name must be longer than or equal to 3 characters',
          },
          value: 'ab',
        },
      ];

      mockReq.body = invalidData;
      mockPlainToInstance.mockReturnValue(transformedData);
      mockValidate.mockResolvedValue(validationErrors);

      const middleware = validateRequest(TestDto);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            property: 'name',
            constraints: {
              length: 'name must be longer than or equal to 3 characters',
            },
          },
        ],
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should use whitelist and forbidNonWhitelisted options', async () => {
      const validData = {
        email: 'test@example.com',
        name: 'John Doe',
        extraField: 'should be removed', // This should be stripped by whitelist
      };
      const transformedData = new TestDto();
      transformedData.email = 'test@example.com';
      transformedData.name = 'John Doe';

      mockReq.body = validData;
      mockPlainToInstance.mockReturnValue(transformedData);
      mockValidate.mockResolvedValue([]);

      const middleware = validateRequest(TestDto);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockValidate).toHaveBeenCalledWith(transformedData, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle validation function throwing error', async () => {
      const validData = { email: 'test@example.com', name: 'John Doe' };
      const transformedData = new TestDto();

      mockReq.body = validData;
      mockPlainToInstance.mockReturnValue(transformedData);
      mockValidate.mockRejectedValue(new Error('Validation service error'));

      const middleware = validateRequest(TestDto);

      await expect(middleware(mockReq, mockRes, mockNext)).rejects.toThrow(
        'Validation service error'
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
