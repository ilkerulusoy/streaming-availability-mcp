# Database Setup Guide

This guide covers PostgreSQL database setup options and optimization with Cloudflare Hyperdrive.

## Database Setup Options

Choose one of these PostgreSQL hosting options:

### Option A: Neon (Recommended - Free Tier)
1. Go to [neon.tech](https://neon.tech) and create account
2. Create a new project
3. Copy the connection string from the dashboard

### Option B: Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com) and create account
2. Create a new project
3. Go to Settings → Database and copy the connection string

### Option C: Railway (Simple Setup)
1. Go to [railway.app](https://railway.app) and create account
2. Create a new PostgreSQL database
3. Copy the connection string from the Connect tab

### Option D: Local PostgreSQL
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

## Database Optimization with Hyperdrive (Optional)

This framework is **optimized to work on Cloudflare** but **doesn't rely on Cloudflare systems** - you can run it on your own servers with any hosting provider.

### Using Cloudflare Hyperdrive (Recommended for Cloudflare deployment)

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

### Alternative: Running on Other Platforms

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

## Database Schema

The framework includes these tables:

- **users** - User accounts with OAuth integration
- **oauth_tokens** - Access and refresh tokens
- **oauth_codes** - Authorization codes for OAuth flow
- **tools** - Available MCP tools
- **user_tool_access** - Tool permissions per user

The schema is automatically created when you run `/init-db` endpoint. 