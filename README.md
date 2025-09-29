# Foodime

Foodime is an AI-powered system for automating phone orders for pizzerias and cafes using ChatGPT for interaction, Twilio for voice handling, and ElevenLabs for text-to-speech.

## System Overview

This system consists of several key components that work together to automate phone orders:

- **Customer Dashboard**: Web interface for businesses to manage their accounts and view orders
- **Business Admin Panel**: Administrative interface for managing customers and monitoring system health
- **Backend System**: API layer handling integrations with Twilio, OpenAI, and ElevenLabs
- **Mobile App**: React Native application for on-the-go management
- **Persistent Database**: Supabase (PostgreSQL) for storing customer data, orders, and configurations

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone git@github.com:TanvirAlam/foodime.git
   cd foodime
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   PORT=3001
   \`\`\`

4. Start the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

## Project Structure

This project uses Turborepo to manage the monorepo structure:

\`\`\`
foodime/
├── apps/                       # Application packages
│   ├── customer-dashboard/     # Customer dashboard (React)
│   ├── admin-panel/           # Business admin panel (React)
│   ├── mobile/                # Mobile app (React Native)
│   └── api/                   # Backend API (Node.js/Express)
├── packages/                   # Shared packages
│   ├── ui/                    # Shared UI components
│   ├── database/              # Database models and migrations
│   ├── ai/                    # AI integrations
│   ├── twilio/                # Twilio integration
│   └── ...                    # Other shared packages
\`\`\`

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [Development Workflow](./docs/development-workflow.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

## License

[MIT](LICENSE)

