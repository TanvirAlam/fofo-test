import { ObjectType, Field, ID, registerEnumType, Int } from 'type-graphql';
import { IsString, Length, IsBoolean, IsOptional, IsDateString, IsInt } from 'class-validator';
import { User } from './User';

export enum RFLCTType {
  USER_ACCESS = 'USER_ACCESS',
  FEATURE_UNLOCK = 'FEATURE_UNLOCK',
  PROMOTION = 'PROMOTION',
  SPECIAL_ACTION = 'SPECIAL_ACTION',
  SYSTEM_COMMAND = 'SYSTEM_COMMAND',
}

registerEnumType(RFLCTType, {
  name: 'RFLCTType',
  description: 'RFLCT code types',
});

@ObjectType()
export class RFLCTCode {
  @Field(() => ID)
  id!: string;

  @Field()
  @IsString()
  @Length(4, 4) // Enforces 4-digit code format as per user preference
  code!: string;

  @Field(() => RFLCTType)
  type!: RFLCTType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsBoolean()
  isActive!: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  userId?: string;

  @Field(() => Int)
  @IsInt()
  usageCount!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  lastUsed?: Date;

  @Field({ nullable: true })
  @IsOptional()
  metadata?: string; // JSON string

  @Field()
  @IsDateString()
  createdAt!: Date;

  @Field()
  @IsDateString()
  updatedAt!: Date;

  // Relations
  @Field(() => User, { nullable: true })
  user?: User;
}
