import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';

interface ValidatedRequest extends Request {
  validatedData?: unknown;
}

export const validateRequest = <T extends object>(dtoClass: new () => T) => {
  return async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const output = plainToInstance(dtoClass, req.body);
    const errors = await validate(output, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const errorMessages = errors.map((error: ValidationError) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }
    req.validatedData = output;
    next();
  };
};
