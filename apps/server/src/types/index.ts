import { Request, Response } from 'express';
import { User } from '../graphql/entities/User';

// Extend Express Request to include user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// GraphQL Context type
export interface GraphQLContext {
  user?: User;
  req: Request;
  res: Response;
}

// Order types
export interface CreateOrderRequest {
  restaurantId: string;
  items: {
    menuItemId: string;
    quantity: number;
    customizations?: Record<string, any>;
  }[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  deliveryInstructions?: string;
  paymentMethod: string;
  tip?: number;
}

// Review types
export interface CreateReviewRequest {
  rating: number;
  comment?: string;
  restaurantId?: string;
  menuItemId?: string;
  images?: string[];
}

// Search and Filter types
export interface SearchQuery {
  q?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  sortBy?: 'name' | 'price' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// AI Chat types
export interface CreateAIChatRequest {
  title?: string;
  provider: string;
  model: string;
}

export interface SendAIMessageRequest {
  chatId: string;
  content: string;
  audioUrl?: string;
}

// RFLCT Code types (using 4-digit format as per user preference)
export interface CreateRFLCTCodeRequest {
  code: string; // 4-digit format
  type: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface VerifyRFLCTCodeRequest {
  code: string;
}

// File upload types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Notification types
export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: string;
  userId?: string;
  data?: Record<string, any>;
}

// Restaurant management types
export interface CreateRestaurantRequest {
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  hours?: Record<string, any>;
}

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
}

// Analytics types
export interface AnalyticsQuery {
  startDate?: string;
  endDate?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
  metrics?: string[];
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topRestaurants: Array<{
    id: string;
    name: string;
    orderCount: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: Date;
  }>;
}

// Error types
export interface ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Database query options
export interface QueryOptions {
  include?: Record<string, any>;
  where?: Record<string, any>;
  orderBy?: Record<string, any>;
  skip?: number;
  take?: number;
}

// Redis cache types
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[];
}

// Email types
export interface EmailOptions {
  to: string | string[];
  subject: string;
  template: string;
  context?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

// Socket.IO event types
export interface SocketEvents {
  'order:status': {
    orderId: string;
    status: string;
    userId: string;
  };
  'notification:new': {
    notification: any;
    userId: string;
  };
  'ai:message': {
    message: any;
    chatId: string;
    userId: string;
  };
}

// Configuration types
export interface ServerConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  databaseUrl: string;
  redisUrl: string;
  dbMaxPoolSize: number;
  dbMinPoolSize: number;
  dbIdleTimeoutMs: number;
  dbConnTimeoutMs: number;
  dbStatementTimeoutMs: number;
  dbQueryTimeoutMs: number;
  uploadPath: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  corsOrigins: string[];
  rateLimitWindow: number;
  rateLimitMax: number;
  emailProvider: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  stripe?: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  sentry: {
    dsn?: string;
    release?: string;
  };
}
