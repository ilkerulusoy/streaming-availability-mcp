# Setup Guide

This guide covers the detailed setup process for the MCP Startup Framework.

## Prerequisites

Before you start, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Cloudflare Account** - [Sign up free](https://dash.cloudflare.com/sign-up)
- **PostgreSQL Database** - See [database setup](database.md) for options
- **Stripe Account** - [Sign up free](https://stripe.com) (for paid tools feature)
- **Git** - For cloning the repository

## Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/f/mcp-startup-framework
cd mcp-startup-framework

# Install dependencies
npm install

# Install Wrangler CLI globally (if not already installed)
npm install -g wrangler
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .dev.vars.example .dev.vars

# Edit .dev.vars with your settings
nano .dev.vars
```

Configure the values in `.dev.vars`:

```ini
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# Security Keys (IMPORTANT: Generate strong, unique keys)
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
COOKIE_ENCRYPTION_KEY="exactly-32-characters-for-encryption"

# Stripe Configuration (for paid tools)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_PRICE_ID_FOR_PREMIUM_MATH="price_your_stripe_price_id_here"
BASE_URL="https://your-worker-domain.workers.dev"
```

### 3. Generate Security Keys

**🔒 Security Note**: Generate strong secrets:

```bash
# Generate JWT secret (64 characters)
openssl rand -hex 32

# Generate cookie encryption key (32 characters)
openssl rand -hex 16
```

### 4. Stripe Setup (for paid tools)

1. Create a [Stripe account](https://stripe.com) and get your secret key
2. Create products and prices in your Stripe dashboard  
3. Set up webhooks for payment completion (optional but recommended)
4. Use test keys for development (`sk_test_...`)

### 5. Cloudflare Setup

```bash
# Login to Cloudflare
wrangler login

# Follow the browser authentication flow
```

### 6. Initialize Database

```bash
# Start development server
npm run dev

# In another terminal, initialize database tables
curl -X POST http://localhost:8787/init-db

# Expected response:
# {"message":"Database initialized successfully"}
```

### 7. Test Your Setup

1. **Open your browser**: Go to `http://localhost:8787`
2. **Register account**: Create a new user account
3. **Test login**: Login with your credentials
4. **Check tools**: Visit `http://localhost:8787/up` to see available tools

## Next Steps

- Read the [Development Guide](development.md) to understand the project structure
- Learn how to [add tools](tools.md) to your server
- Explore [custom routes](custom-routes.md) for REST API endpoints
- When ready, follow the [Deployment Guide](deployment.md) for production 