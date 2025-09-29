import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsMobilePhone,
  Matches,
} from 'class-validator';
import { REGEX } from '../../utils/constant';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(REGEX.PASSWORD, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)',
  })
  password!: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName?: string;

  @IsOptional()
  @IsMobilePhone(
    undefined,
    {},
    { message: 'Please provide a valid phone number' }
  )
  phone?: string;
}
