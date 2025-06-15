# MCP Startup Framework

A complete framework for building remote Model Context Protocol (MCP) servers on Cloudflare Workers with OAuth authentication, PostgreSQL database, and Stripe-powered paid tools.

## 🚀 Features

- **🔐 OAuth 2.1 Provider** - Complete authentication with user registration/login
- **🗄️ PostgreSQL Integration** - Full database schema with user management
- **💳 Paid Tools Framework** - Stripe-powered premium tools
- **⚡ Cloudflare Workers** - Serverless deployment with global edge distribution
- **🛠️ MCP Tools Framework** - Modular tool system with user context
- **🔌 REST API Routes** - Easy-to-use system for adding custom endpoints
- **🎨 Beautiful UI** - Responsive login/registration pages
- **📱 Cross-Platform** - Works on desktop, web, and mobile MCP clients

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account
- PostgreSQL database (see [database setup](docs/database.md))
- Stripe account (for paid tools)

### Installation

```bash
# Clone the repository
git clone https://github.com/f/mcp-startup-framework
cd mcp-startup-framework

# Install dependencies
npm install

# Copy environment template
cp .dev.vars.example .dev.vars
```

### Configuration

Edit `.dev.vars` with your settings:

```ini
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
COOKIE_ENCRYPTION_KEY="32-character-encryption-key"
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
STRIPE_PRICE_ID_FOR_PREMIUM_MATH="price_your_stripe_price_id"
BASE_URL="https://your-domain.workers.dev"
```

### Development

```bash
# Start development server
npm run dev

# Initialize database (in another terminal)
curl -X POST http://localhost:8787/init-db

# Visit http://localhost:8787 to register/login
```

## 🛠️ Adding Tools & Routes

Everything starts from `src/index.ts`:

```typescript
// Register MCP tools
backend
  .registerTool(registerAddTool)
  .registerTool(registerGreetingTool)
  .registerTool(registerPremiumMathTool);

// Add REST API routes
backend
  .route('GET', '/api/status', (c) => c.json({ status: 'ok' }))
  .authRoute('GET', '/api/profile', (c, userContext) => 
    c.json({ user: userContext })
  );
```

See [Tools Guide](docs/tools.md) and [Routes Guide](docs/custom-routes.md) for details.

## 🚀 Deployment

```bash
# Set production secrets
wrangler secret put JWT_SECRET
wrangler secret put COOKIE_ENCRYPTION_KEY
wrangler secret put STRIPE_SECRET_KEY

# Set custom price IDs per paid tool
wrangler secret put STRIPE_PRICE_ID_FOR_PREMIUM_MATH

# Deploy to Cloudflare
npm run deploy
```

See [Deployment Guide](docs/deployment.md) for full instructions.

## 📚 Documentation

- [**Setup Guide**](docs/setup.md) - Detailed installation and configuration
- [**Database Setup**](docs/database.md) - PostgreSQL options and optimization
- [**Development Guide**](docs/development.md) - Project structure and workflows
- [**Adding Tools**](docs/tools.md) - Create free and paid MCP tools
- [**Custom Routes**](docs/custom-routes.md) - Add REST API endpoints
- [**Views Customization**](docs/views.md) - Customize all UI pages (login, consent, payment, etc.)
- [**Deployment**](docs/deployment.md) - Production deployment instructions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details.
