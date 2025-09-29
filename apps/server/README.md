# Foodime Server

A comprehensive backend server for the Foodime application ecosystem, providing REST APIs for mobile, web, and admin clients with PostgreSQL database integration.

## Features

- **RESTful API**: Complete REST API for all client applications
- **PostgreSQL Database**: Robust relational database with Prisma ORM
- **Authentication**: JWT-based authentication with role-based access control
- **Real-time Communication**: Socket.IO for live updates
- **File Upload**: Multi-format image upload with processing
- **Email Integration**: Transactional email support
- **Payment Processing**: Stripe integration for payments
- **RFLCT Integration**: 4-digit code system for special features
- **AI Chat Support**: Backend for RFLCT AI conversations
- **Analytics & Logging**: Comprehensive logging and analytics
- **Rate Limiting**: Built-in rate limiting and security features

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.IO
- **Validation**: Express Validator + Zod
- **Logging**: Winston
- **File Processing**: Sharp for image processing
- **Caching**: Redis (optional)
- **Email**: Nodemailer
- **Testing**: Jest + Supertest

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- Redis (optional)
- pnpm package manager

### Installation

1. **Install dependencies**
```bash
pnpm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start PostgreSQL** (using Docker)
```bash
pnpm docker:up
```

4. **Set up the database**
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed
```

5. **Start the development server**
```bash
pnpm dev
```

The server will be available at `http://localhost:3001`

## Database Schema

The database includes comprehensive models for:

- **User Management**: Users, sessions, authentication
- **Food & Restaurants**: Restaurants, menu categories, menu items
- **Orders**: Order management, order items, payment tracking
- **Reviews & Ratings**: User reviews for restaurants and items
- **User Preferences**: Favorites, addresses, notifications
- **AI Integration**: AI chats, messages for RFLCT AI
- **RFLCT Codes**: 4-digit code system with usage tracking
- **Analytics**: API logs, system events, usage analytics

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/change-password` - Change password

### RFLCT Codes (4-digit format)
- `POST /api/v1/rflct/codes` - Create RFLCT code (Admin)
- `POST /api/v1/rflct/verify` - Verify/use RFLCT code
- `GET /api/v1/rflct/my-codes` - Get user's codes
- `GET /api/v1/rflct/codes` - List all codes (Admin)
- `PATCH /api/v1/rflct/codes/:id` - Update code (Admin)
- `DELETE /api/v1/rflct/codes/:id` - Delete code (Admin)
- `GET /api/v1/rflct/analytics` - Code analytics (Admin)

### Additional Routes
- `GET /api/v1/users/*` - User management
- `GET /api/v1/restaurants/*` - Restaurant operations
- `GET /api/v1/menu/*` - Menu management
- `GET /api/v1/orders/*` - Order processing
- `GET /api/v1/reviews/*` - Review system
- `GET /api/v1/notifications/*` - Notification management
- `GET /api/v1/ai/*` - AI chat integration
- `GET /api/v1/analytics/*` - Analytics and reporting
- `POST /api/v1/upload/*` - File upload endpoints

## Development Commands

```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm db:migrate         # Run database migrations
pnpm db:generate        # Generate Prisma client
pnpm db:studio          # Open Prisma Studio
pnpm db:seed            # Seed the database
pnpm db:reset           # Reset database

# Docker
pnpm docker:up          # Start PostgreSQL & Redis
pnpm docker:down        # Stop containers

# Testing & Quality
pnpm test               # Run tests
pnpm test:watch         # Run tests in watch mode
pnpm test:coverage      # Run tests with coverage
pnpm lint               # Lint code
pnpm check-types        # Type checking
```

## Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Optional integrations
REDIS_URL="redis://localhost:6379"
STRIPE_SECRET_KEY="sk_test_..."
OPENAI_API_KEY="sk-..."
```

## Database Management

### Migrations
```bash
# Create and apply migration
pnpm db:migrate

# Reset database (caution: destroys all data)
pnpm db:reset
```

### Seeding
```bash
# Run seed script
pnpm db:seed
```

### Prisma Studio
```bash
# Open database browser
pnpm db:studio
```

## RFLCT Integration

The server supports 4-digit RFLCT codes as per user preferences:

- **Code Format**: Always 4 digits (1234, not 123456)
- **Types**: USER_ACCESS, FEATURE_UNLOCK, PROMOTION, SPECIAL_ACTION, SYSTEM_COMMAND
- **Usage Tracking**: Comprehensive analytics and usage statistics
- **Security**: Role-based access control for code management

## Socket.IO Events

Real-time events supported:

- `order:status` - Order status updates
- `notification:new` - New notifications
- `ai:message` - AI chat messages

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Configurable rate limits
- **CORS**: Configurable CORS origins
- **JWT**: Secure token-based authentication
- **Input Validation**: Request validation middleware
- **Password Hashing**: bcrypt with salt rounds

## Logging & Monitoring

- **Winston Logger**: Structured logging with levels
- **API Logging**: Request/response logging
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Request timing and analytics

## Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Docker Deployment
```bash
# Build and run with Docker
docker build -t foodime-server .
docker run -p 3001:3001 foodime-server
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database URL
- Set secure JWT secret
- Configure email and payment providers

## Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit a pull request

## API Documentation

Visit `http://localhost:3001` when the server is running to see available endpoints and server status.

## License

This project is part of the foodime-turbo monorepo.
