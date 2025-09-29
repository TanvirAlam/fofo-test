import { ObjectType, Field, ID, registerEnumType, Float } from 'type-graphql';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Order status types',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Payment status types',
});

@ObjectType()
export class Order {
  constructor(data: Partial<Order> = {}) {
    Object.assign(this, {
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      subtotal: 0,
      tax: 0,
      deliveryFee: 0,
      tip: 0,
      total: 0,
      orderTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    });
  }
  @Field(() => ID)
  id!: string;

  @Field()
  @IsString()
  orderNumber!: string;

  @Field(() => OrderStatus)
  status!: OrderStatus;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  restaurantId!: string;

  @Field()
  deliveryAddress!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  deliveryInstructions?: string;

  @Field(() => Float)
  subtotal!: number;

  @Field(() => Float)
  tax!: number;

  @Field(() => Float)
  deliveryFee!: number;

  @Field(() => Float)
  tip!: number;

  @Field(() => Float)
  total!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @Field(() => PaymentStatus)
  paymentStatus!: PaymentStatus;

  @Field()
  @IsDateString()
  orderTime!: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  actualDelivery?: Date;

  @Field()
  @IsDateString()
  createdAt!: Date;

  @Field()
  @IsDateString()
  updatedAt!: Date;

  // Note: Relations like user, restaurant, orderItems will be handled by separate resolvers
  // to avoid circular import issues
}
