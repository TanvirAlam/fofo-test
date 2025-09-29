import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import {
  IsEmail,
  Length,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export enum UserRole {
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role types',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(3, 50)
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 50)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 50)
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @Field()
  @IsBoolean()
  isVerified!: boolean;

  @Field()
  @IsBoolean()
  isActive!: boolean;

  @Field(() => UserRole)
  role!: UserRole;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  lastLogin?: Date;

  @Field()
  @IsDateString()
  createdAt!: Date;

  @Field()
  @IsDateString()
  updatedAt!: Date;

  // Note: Relations like orders, reviews, etc. will be handled by separate resolvers
  // to avoid circular import issues and keep the schema clean
}
