# MCP Server Boilerplate with OAuth & PostgreSQL

A complete boilerplate for building remote Model Context Protocol (MCP) servers on Cloudflare Workers with custom OAuth authentication, PostgreSQL database integration, and Stripe-powered paid tools.

## 🚀 What You Get

This boilerplate provides everything you need to build production-ready MCP servers:

- **🔐 Complete OAuth 2.1 Provider** - Custom OAuth implementation with user registration/login
- **🗄️ PostgreSQL Integration** - Full database schema with user management and OAuth tokens
- **💳 Paid Tools Framework** - Stripe-powered premium tools with automatic payment handling
- **⚡ Cloudflare Workers** - Serverless deployment with global edge distribution
- **🛠️ MCP Tools Framework** - Modular tool system with user context
- **🔌 Custom Routes Framework** - Easy-to-use system for adding REST API endpoints
- **🎨 Beautiful UI** - Responsive login/registration pages with customizable consent screen
- **🔒 Security First** - JWT tokens, bcrypt hashing, PKCE support
- **📱 Mobile Ready** - Works on desktop, web, and mobile MCP clients
- **🔧 Developer Friendly** - TypeScript, hot reload, comprehensive error handling

### Available MCP Tools

#### Free Tools
- `add` - Basic math operations
- `userInfo` - Get current user information  
- `personalGreeting` - Personalized user greetings
- `generateImage` - AI image generation
- `getUserStats` - User statistics and analytics

#### Premium Tools (Paid)
- `premium_calculate` - Advanced mathematical calculations with higher precision and complex operations

## ⚡ Quick Start from index.ts

**Everything starts from `src/index.ts`** - this is your main configuration file where you can easily:

### 🛠️ Register MCP Tools
```typescript
// Register free MCP tools with one line each
backend
  .registerTool(registerMeTool)
  .registerTool(registerGreetingTool)
  .registerTool(registerAddTool)
  .registerTool(registerGenerateImageTool)
  // Register premium paid tools
  .registerTool(registerPremiumMathTool);
```

### 💳 Create Paid Tools
```typescript
// Example paid tool implementation
export async function registerPremiumAnalyticsTool(server: McpServer, userContext: UserContext, env: Env) {
  await registerPaidTool(
    server,
    userContext,
    env,
    "premium_analytics",
    "Generate advanced analytics reports with AI insights",
    {
      dataSource: z.string().describe("The data source to analyze"),
      reportType: z.enum(["summary", "detailed", "predictive"])
    },
    async ({ dataSource, reportType }) => {
      // Your premium tool logic here
      return {
        content: [{ type: "text", text: `Premium report for ${userContext.name}` }]
      };
    },
    {
      priceId: env.STRIPE_PRICE_ID,
      paymentReason: "Premium analytics require a subscription.",
      mode: 'subscription'
    }
  );
}
```

### 🔌 Add Custom REST API Endpoints
```typescript
// Public endpoints (no authentication required)
backend
  .route('GET', '/api/ping', (c) => {
    return c.json({ message: 'pong', timestamp: new Date().toISOString() });
  })
  .route('POST', '/api/echo', async (c) => {
    const body = await c.req.json();
    return c.json({ echo: body, timestamp: new Date().toISOString() });
  });

// Protected endpoints (OAuth token required)
backend
  .authRoute('GET', '/api/profile', (c, userContext, env) => {
    return c.json({
      message: 'User profile data',
      user: userContext,
      timestamp: new Date().toISOString()
    });
  })
  .authRoute('POST', '/api/user/settings', async (c, userContext, env) => {
    const settings = await c.req.json();
    return c.json({
      message: 'Settings updated successfully',
      userId: userContext.userId,
      settings,
      timestamp: new Date().toISOString()
    });
  });
```

### 🎨 Customizable Consent Screen

The OAuth consent screen is **fully customizable** with pure HTML, CSS, and JavaScript located in `src/auth/views/consent.ts`. Features include:

- **🌙 Dark/Light Mode Toggle** - Automatic system preference detection with manual override
- **📱 Responsive Design** - Mobile-first design with Tailwind CSS
- **🎨 Custom Branding** - Easy logo, colors, and styling customization
- **⚡ Real-time Updates** - JavaScript-powered consent flow with loading states
- **🔒 Security Features** - CSRF protection and secure form handling

**Customize the consent screen:**
```typescript
// In src/auth/views/consent.ts - modify the generateConsentPage function
export function generateConsentPage(data: ConsentPageData, config: ConsentPageConfig = {}) {
  const {
    title = "Your Custom Title",           // ← Customize title
    subtitle = "Your custom subtitle",     // ← Customize subtitle  
    logoUrl = "/your-logo.png",           // ← Add your logo
    brandColor = "purple"                 // ← Change brand color
  } = config;
  
  // Full HTML/CSS/JS customization available in the template string
  return `<!DOCTYPE html>...`;
}
```

The consent screen includes:
- Application info display with logos
- User profile information
- Granular permission scopes
- Terms of Service and Privacy Policy links
- Beautiful animations and transitions
- Error handling and loading states

## 🔌 Custom Routes Framework

This boilerplate includes a powerful **custom routes framework** that makes it easy to add REST API endpoints alongside your MCP tools:

### Public Routes (No Authentication)
```typescript
backend.route('GET', '/api/status', (c) => {
  return c.json({ status: 'operational', version: '1.0.0' });
});

backend.route('POST', '/api/webhook', async (c) => {
  const payload = await c.req.json();
  // Process webhook
  return c.json({ received: true });
});
```

### Protected Routes (OAuth Required)
```typescript
backend.authRoute('GET', '/api/user/dashboard', (c, userContext, env) => {
  // userContext contains: { userId, name, username, email, scopes }
  return c.json({
    welcomeMessage: `Hello ${userContext.name}!`,
    userStats: { /* ... */ }
  });
});

backend.authRoute('PUT', '/api/user/profile', async (c, userContext, env) => {
  const updates = await c.req.json();
  // Update user profile in database
  return c.json({ success: true });
});
```

### Framework Features
- **🔒 Automatic Authentication** - Protected routes get user context automatically
- **📝 Type Safety** - Full TypeScript support with proper typing
- **🌐 HTTP Methods** - Support for GET, POST, PUT, DELETE, PATCH
- **📊 Request Handling** - Easy access to headers, body, query params
- **🔄 Response Helpers** - JSON, HTML, redirect, and custom responses
- **⚡ Performance** - Built on Hono framework for maximum speed

This makes it easy to create complete applications with both MCP tools and traditional REST APIs!

## 📋 Prerequisites

Before you start, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Cloudflare Account** - [Sign up free](https://dash.cloudflare.com/sign-up)
- **PostgreSQL Database** - See [database options](#database-setup-options) below
- **Stripe Account** - [Sign up free](https://stripe.com) (for paid tools feature)
- **Git** - For cloning the repository

## 🏗️ Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/f/mcp-cloudflare-boilerplate
cd mcp-cloudfare-boilerplate

# Install dependencies
npm install

# Install Wrangler CLI globally (if not already installed)
npm install -g wrangler
```

### 2. Database Setup Options

Choose one of these PostgreSQL hosting options:

#### Option A: Neon (Recommended - Free Tier)
1. Go to [neon.tech](https://neon.tech) and create account
2. Create a new project
3. Copy the connection string from the dashboard

#### Option B: Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com) and create account
2. Create a new project
3. Go to Settings → Database and copy the connection string

#### Option C: Railway (Simple Setup)
1. Go to [railway.app](https://railway.app) and create account
2. Create a new PostgreSQL database
3. Copy the connection string from the Connect tab

#### Option D: Local PostgreSQL
```bash
# Using Docker (recommended for local development)
docker run --name mcp-postgres \
  -e POSTGRES_DB=mcpserver \
  -e POSTGRES_USER=mcpuser \
  -e POSTGRES_PASSWORD=mcppassword \
  -p 5432:5432 \
  -d postgres:15

# Connection string will be:
# postgresql://mcpuser:mcppassword@localhost:5432/mcpserver
```

### Database Optimization with Hyperdrive (Optional)

This boilerplate is **optimized to work on Cloudflare** but **doesn't rely on Cloudflare systems** - you can run it on your own servers with any hosting provider.

#### Using Cloudflare Hyperdrive (Recommended for Cloudflare deployment)

[Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) dramatically improves database performance by connection pooling and global caching. To enable Hyperdrive:

1. **Create a Hyperdrive configuration** in your Cloudflare dashboard:
   ```bash
   # Via Wrangler CLI
   wrangler hyperdrive create my-mcp-db --connection-string="postgresql://username:password@host:port/database"
   ```

2. **Update wrangler.toml** to reference your Hyperdrive:
   ```toml
   [[hyperdrive]]
   binding = "HYPERDRIVE"
   id = "your-hyperdrive-id"
   ```

3. **Use Hyperdrive in your environment**:
   ```ini
   # In .dev.vars or production secrets
   DATABASE_URL="postgresql://username:password@host:port/database"
   # Hyperdrive will automatically optimize this connection
   ```

#### Alternative: Running on Other Platforms

**Don't want to use Cloudflare?** Simply change your deployment environment:

- **Vercel**: Use `@vercel/node` runtime with PostgreSQL
- **Railway**: Deploy directly with built-in PostgreSQL
- **AWS Lambda**: Use with RDS or Aurora Serverless
- **Google Cloud Run**: Deploy with Cloud SQL
- **Self-hosted**: Deploy with Docker and any PostgreSQL instance

The codebase uses standard PostgreSQL connections and OAuth2, making it **platform-agnostic**. Just update your:
- Database connection string
- Deployment configuration
- Environment variables

No Cloudflare-specific dependencies are required for core functionality.

### 3. Configure Environment

```bash
# Copy environment template
cp .dev.vars.example .dev.vars

# Edit .dev.vars with your settings
nano .dev.vars
```

Configure the values to match your environment in .dev.vars:

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

**🔒 Security Note**: Generate strong secrets:
```bash
# Generate JWT secret (64 characters)
openssl rand -hex 32

# Generate cookie encryption key (32 characters)
openssl rand -hex 16
```

**💳 Stripe Setup** (for paid tools):
1. Create a [Stripe account](https://stripe.com) and get your secret key
2. Create products and prices in your Stripe dashboard  
3. Set up webhooks for payment completion (optional but recommended)
4. Use test keys for development (`sk_test_...`)

### 4. Cloudflare Setup

```bash
# Login to Cloudflare
wrangler login

# Follow the browser authentication flow
```

### 5. Initialize Database

```bash
# Start development server
npm run dev

# In another terminal, initialize database tables
curl -X POST http://localhost:8787/init-db

# Expected response:
# {"message":"Database initialized successfully"}
```

### 6. Test Your Setup

1. **Open your browser**: Go to `http://localhost:8787`
2. **Register account**: Create a new user account
3. **Test login**: Login with your credentials
4. **Check tools**: Visit `http://localhost:8787/up` to see available tools

## 🚀 Deployment

### Production Deployment

1. **Set production secrets**:
```bash
# Set each secret securely (you'll be prompted to enter values)
wrangler secret put JWT_SECRET
wrangler secret put COOKIE_ENCRYPTION_KEY
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_PRICE_ID_FOR_PREMIUM_MATH
```

2. **Deploy to Cloudflare**:
```bash
npm run deploy
```

3. **Initialize production database**:
```bash
# Replace with your actual worker URL
curl -X POST https://your-worker.your-subdomain.workers.dev/init-db
```

4. **Update OAuth settings**: Update any OAuth client redirect URIs to use your production URL.

### Custom Domain (Optional)

1. In Cloudflare dashboard, go to Workers & Pages
2. Select your worker
3. Go to Settings → Triggers
4. Add custom domain

## 🔧 Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy

# Run tests (if you add them)
npm test
```

### Project Structure

```
mcp-cf-boilerplate/
├── src/
│   ├── auth/                 # Authentication system
│   │   ├── handlers/         # OAuth & auth endpoints
│   │   ├── middleware/       # Session management
│   │   ├── oauth2.ts         # OAuth2 server implementation
│   │   └── views/            # Login/register UI
│   ├── database/             # Database models & queries
│   ├── server/               # MCP server implementation
│   ├── tools/                # MCP tools (modular)
│   ├── types.ts              # TypeScript definitions
│   └── index.ts              # Main entry point
├── wrangler.toml             # Cloudflare Workers config
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

### Adding New MCP Tools

#### Free Tools

1. **Create tool file**: `src/tools/myTool.ts`
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UserContext } from "../types";

export function registerMyTool(server: McpServer, userContext: UserContext, env: Env) {
  server.tool("myTool", "Description of my tool", {
    input: {
      type: "object",
      properties: {
        message: { type: "string", description: "Input message" }
      },
      required: ["message"]
    }
  }, async ({ message }) => {
    return {
      content: [{
        type: "text",
        text: `Hello ${userContext.name}! You said: ${message}`
      }]
    };
  });
}
```

2. **Export from index**: Add to `src/tools/index.ts`
```typescript
export { registerMyTool } from './myTool';
```

3. **Register in main**: Add to `src/index.ts`
```typescript
import { registerMyTool } from "./tools";

backend.registerTool(registerMyTool);
```

#### Paid Tools

**💳 For detailed paid tools implementation**, see the [Paid Tools Guide](PAID_TOOLS_GUIDE.md) which covers:

- Complete setup instructions with Stripe
- Payment flow and user experience
- One-time payments vs subscriptions vs usage-based billing
- Security considerations and production deployment
- Testing with Stripe test mode
- Custom payment pages and error handling

**Quick Example**:
```typescript
// src/tools/premiumTool.ts
import { registerPaidTool } from "../server/paidTool";

export async function registerPremiumTool(server: McpServer, userContext: UserContext, env: Env) {
  await registerPaidTool(
    server, userContext, env,
    "premium_feature", "Description", params, callback,
    {
      priceId: env.STRIPE_PRICE_ID,
      paymentReason: "This premium feature requires payment.",
      mode: 'subscription'
    }
  );
}
```

## 🔌 Using Your MCP Server

### With Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://your-worker.your-subdomain.workers.dev/mcp"
      ]
    }
  }
}
```

### MCP Endpoints
- `POST /mcp` - Main MCP endpoint (requires OAuth)
- `GET /up` - Health check and server info

### Payment Endpoints (Authenticated)
- `GET /payment-success` - Payment confirmation page with user info
- `GET /payment-cancelled` - Payment cancelled page with user info

### Management Endpoints
- `POST /init-db` - Initialize database (run once)


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add JSDoc comments for public APIs
- Update README for new features
- Test OAuth flows thoroughly
- Ensure database migrations are safe

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol this server implements
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform  
- [Hono](https://hono.dev/) - Web framework for Cloudflare Workers
- [@node-oauth/oauth2-server](https://github.com/node-oauth/node-oauth2-server) - OAuth2 implementation
- [Stripe Agent Toolkit](https://github.com/stripe/agent-toolkit) - Payment integration for AI tools
- [Stripe](https://stripe.com/) - Payment processing platform

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.
