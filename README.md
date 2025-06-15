# MCP Startup Framework

A complete framework for building remote Model Context Protocol (MCP) servers on Cloudflare Workers with OAuth authentication, PostgreSQL database, and Stripe-powered paid tools.

## 🚀 Features

- **🔐 OAuth 2.1 Provider** - Complete authentication with user registration/login
- **🗄️ PostgreSQL Integration** - Scalable production-ready database with connection pooling
- **💳 Paid Tools Framework** - Stripe-powered premium tools with subscription support
- **🌐 Platform Agnostic** - Optimized for Cloudflare Workers but deployable anywhere (Vercel, Railway, AWS, self-hosted)
- **🛠️ MCP Tools Framework** - Modular tool system with user context
- **🔌 REST API Routes** - Easy-to-use system for adding custom endpoints
- **🎨 Custom Views** - Extensible UI system for privacy policies, ToS, documentation pages
- **📡 Streamable HTTP Transport** - Works with `mcp-remote` for local Claude Desktop integration
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

### Custom Views

Extend beyond MCP with custom pages:

```typescript
// Add privacy policy, terms of service, documentation
backend
  .route('GET', '/privacy', (c) => c.html(generatePrivacyPage()))
  .route('GET', '/terms', (c) => c.html(generateTermsPage()))
  .route('GET', '/docs', (c) => c.html(generateDocsPage()));
```

See [Views Guide](docs/views.md) for creating custom pages.

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

## 🔗 Integration Options

### Using claude.ai (Pro Plan)

For claude.ai Pro users, you can integrate directly:

1. Navigate to [claude.ai settings](https://claude.ai/settings/integrations)
2. Click "Add Integration" 
3. Enter your server URL: `https://your-domain.workers.dev/sse`
4. Complete the OAuth flow

### Using Claude Desktop

For local Claude Desktop app:

#### 1. Install MCP Remote Client
```bash
npm install -g mcp-remote
```

#### 2. Configure Claude Desktop
Open Claude Desktop settings: **Settings > Developer > Edit Config**

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "my-startup": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://your-domain.workers.dev/mcp"
      ]
    }
  }
}
```

#### 3. Restart Claude Desktop
After saving, restart Claude Desktop. Your MCP tools will appear in the chat interface.

### Transport Options

The framework supports multiple transport protocols:
- **Streamable HTTP** (default) - `/mcp` endpoint
- **Server-Sent Events (SSE)** - `/sse` endpoint

Both work seamlessly with `mcp-remote` for local development and production use.

## 🌐 Platform Flexibility

While optimized for **Cloudflare Workers**, this framework runs anywhere:

- **Vercel**: Deploy with `@vercel/node` runtime
- **Railway**: One-click deploy with built-in PostgreSQL
- **AWS Lambda**: Use with RDS or Aurora Serverless
- **Google Cloud Run**: Deploy with Cloud SQL
- **Self-hosted**: Run with Docker on any VPS

Simply update your database connection and deployment configuration!

### Production Database

The framework works with any PostgreSQL provider:
- **Neon** - Serverless PostgreSQL with autoscaling
- **Supabase** - PostgreSQL with real-time features  
- **Railway** - Managed PostgreSQL with automatic backups
- **Amazon RDS** - Enterprise-grade PostgreSQL
- **Cloudflare Hyperdrive** - Connection pooling for optimal performance

All providers support the scalability needed for production MCP servers.

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
