import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  ID,
  InputType,
  ObjectType,
  Field,
} from 'type-graphql';
import { IsEmail, Length } from 'class-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { UserRepository } from '../../repositories/UserRepository';
import { config } from '../../config';
import { logger } from '../../utils/logger';

// Input types
@InputType()
class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(6, 255)
  password!: string;

  @Field({ nullable: true })
  @Length(1, 50)
  firstName?: string;

  @Field({ nullable: true })
  @Length(1, 50)
  lastName?: string;

  @Field({ nullable: true })
  phone?: string;
}

@InputType()
class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
class AuthResponse {
  @Field()
  user!: User;

  @Field()
  token!: string;
}

// Context type
interface Context {
  user?: User;
}

// Authentication middleware
function AuthMiddleware(
  { context }: { context: Context },
  next: () => Promise<any>
) {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return next();
}

@Resolver(User)
export class UserResolver {
  private userRepository = new UserRepository();

  @Query(() => User, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async me(@Ctx() ctx: Context): Promise<User | null> {
    return ctx.user || null;
  }

  @Query(() => [User])
  @UseMiddleware(AuthMiddleware)
  async users(
    @Arg('limit', { defaultValue: 50 }) limit: number,
    @Arg('offset', { defaultValue: 0 }) offset: number
  ): Promise<User[]> {
    return await this.userRepository.findAll(limit, offset);
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async user(@Arg('id', () => ID) id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  @Mutation(() => AuthResponse)
  async register(@Arg('input') input: RegisterInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Create user
      const user = await this.userRepository.create({
        email: input.email,
        password: hashedPassword,
        fullname: `${input.firstName ?? ''} ${input.lastName ?? ''}`.trim(),
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );

      logger.info(`User registered: ${user.email}`);

      return { user, token };
    } catch (error) {
      logger.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  }

  @Mutation(() => AuthResponse)
  async login(@Arg('input') input: LoginInput): Promise<AuthResponse> {
    try {
      // Find user
      const user = await this.userRepository.findByEmail(input.email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isValidPassword = await bcrypt.compare(
        input.password,
        user.password
      );
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is inactive');
      }

      // Update last login
      await this.userRepository.update(user.id, { lastLogin: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );

      logger.info(`User logged in: ${user.email}`);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return { user: userWithoutPassword as User, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw new Error('Login failed');
    }
  }

  @Mutation(() => User)
  @UseMiddleware(AuthMiddleware)
  async updateProfile(
    @Arg('firstName', { nullable: true }) firstName: string,
    @Arg('lastName', { nullable: true }) lastName: string,
    @Arg('phone', { nullable: true }) phone: string,
    @Ctx() ctx: Context
  ): Promise<User> {
    if (!ctx.user) {
      throw new Error('Authentication required');
    }

    const updatedUser = await this.userRepository.update(ctx.user.id, {
      firstName,
      lastName,
      phone,
    });

    if (!updatedUser) {
      throw new Error('Failed to update user profile');
    }

    return updatedUser;
  }
}
