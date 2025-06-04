# MCP Server Boilerplate with OAuth & PostgreSQL

A complete boilerplate for building remote Model Context Protocol (MCP) servers on Cloudflare Workers with custom OAuth authentication and PostgreSQL database integration.

## 🚀 What You Get

This boilerplate provides everything you need to build production-ready MCP servers:

- **🔐 Complete OAuth 2.1 Provider** - Custom OAuth implementation with user registration/login
- **🗄️ PostgreSQL Integration** - Full database schema with user management and OAuth tokens
- **⚡ Cloudflare Workers** - Serverless deployment with global edge distribution
- **🛠️ MCP Tools Framework** - Modular tool system with user context
- **🎨 Beautiful UI** - Responsive login/registration pages
- **🔒 Security First** - JWT tokens, bcrypt hashing, PKCE support
- **📱 Mobile Ready** - Works on desktop, web, and mobile MCP clients
- **🔧 Developer Friendly** - TypeScript, hot reload, comprehensive error handling

### Available MCP Tools

- `add` - Basic math operations
- `userInfo` - Get current user information  
- `personalGreeting` - Personalized user greetings
- `generateImage` - AI image generation
- `getUserStats` - User statistics and analytics

## 📋 Prerequisites

Before you start, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Cloudflare Account** - [Sign up free](https://dash.cloudflare.com/sign-up)
- **PostgreSQL Database** - See [database options](#database-setup-options) below
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

Add your configuration:

```ini
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# Security Keys (IMPORTANT: Generate strong, unique keys)
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
COOKIE_ENCRYPTION_KEY="exactly-32-characters-for-encryption"

# Optional: Image Generation (if using Workers AI)
# ALLOWED_IMAGE_USERS="username1,username2"
```

**🔒 Security Note**: Generate strong secrets:
```bash
# Generate JWT secret (64 characters)
openssl rand -hex 32

# Generate cookie encryption key (32 characters)
openssl rand -hex 16
```

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

## 🔌 Using Your MCP Server

### With Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "npx",
      "args": [
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

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.
