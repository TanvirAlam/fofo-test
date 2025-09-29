import { ObjectType, Field, ID, Float, Int } from 'type-graphql';
import { Length, IsOptional, IsBoolean, IsNumber, IsDateString, IsEmail, IsUrl } from 'class-validator';

@ObjectType()
export class Restaurant {
  constructor(data: Partial<Restaurant> = {}) {
    Object.assign(this, {
      isActive: false,
      rating: 0,
      totalReviews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    });
  }
  @Field(() => ID)
  id!: string;

  @Field()
  @Length(1, 100)
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 500)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  image?: string;

  @Field({ nullable: true })
  @IsOptional()
  logo?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  website?: string;

  @Field()
  @Length(1, 200)
  address!: string;

  @Field()
  @Length(1, 100)
  city!: string;

  @Field()
  @Length(1, 100)
  state!: string;

  @Field()
  @Length(1, 20)
  zipCode!: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field()
  @IsBoolean()
  isActive!: boolean;

  @Field(() => Float)
  @IsNumber()
  rating!: number;

  @Field(() => Int)
  @IsNumber()
  totalReviews!: number;

  @Field({ nullable: true })
  @IsOptional()
  hours?: string; // JSON string

  @Field()
  @IsDateString()
  createdAt!: Date;

  @Field()
  @IsDateString()
  updatedAt!: Date;

  // Note: Relations like menuCategories, orders, reviews, favorites will be handled by separate resolvers
  // to avoid circular import issues
}
