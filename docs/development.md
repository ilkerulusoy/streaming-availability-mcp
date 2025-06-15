# Development Guide

This guide covers the development workflow, project structure, and best practices.

## Available Scripts

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

## Project Structure

```
mcp-startup-framework/
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
├── docs/                     # Documentation
├── wrangler.toml             # Cloudflare Workers config
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Main documentation
```

## Key Components

### Authentication (`src/auth/`)
- **handlers/** - HTTP endpoints for login, register, OAuth flow
- **middleware/** - Session validation and user context
- **oauth2.ts** - OAuth 2.1 server implementation
- **views/** - HTML templates for login/consent screens

### Database (`src/database/`)
- **schema.ts** - Database table definitions
- **queries.ts** - SQL queries and database operations
- **init.ts** - Database initialization logic

### MCP Server (`src/server/`)
- **index.ts** - Main MCP server setup
- **backend.ts** - Backend framework with routing
- **paidTool.ts** - Paid tools framework with Stripe

### Tools (`src/tools/`)
- Individual tool implementations
- Modular design for easy addition/removal
- Both free and paid tool examples

## Development Workflow

### 1. Local Development

```bash
# Start dev server with hot reload
npm run dev

# Server runs on http://localhost:8787
```

### 2. Making Changes

1. **Edit code** - Changes auto-reload in development
2. **Type check** - Run `npm run type-check` to catch errors
3. **Test locally** - Use the web UI or MCP client
4. **Commit changes** - Follow conventional commits

### 3. Adding Features

See specific guides for:
- [Adding MCP Tools](tools.md)
- [Adding REST Routes](custom-routes.md)
- [Customizing OAuth](oauth-consent.md)

## Environment Variables

Development variables in `.dev.vars`:

```ini
# Database
DATABASE_URL="postgresql://..."

# Security
JWT_SECRET="development-secret"
COOKIE_ENCRYPTION_KEY="32-char-dev-key"

# Stripe (test mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRICE_ID_FOR_PREMIUM_MATH="price_..."

# URLs
BASE_URL="http://localhost:8787"
```

## Best Practices

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules (if configured)
- Write descriptive variable names
- Add JSDoc comments for public APIs

### Security
- Never commit secrets
- Validate all user inputs
- Use prepared statements for SQL
- Implement proper error handling

### Performance
- Minimize database queries
- Use caching where appropriate
- Keep response payloads small
- Optimize for edge computing

### Testing
- Test OAuth flows thoroughly
- Verify tool permissions
- Check error scenarios
- Test payment flows in Stripe test mode

## Debugging

### MCP Inspector

The [MCP Inspector](https://github.com/modelcontextprotocol/inspector) is a powerful visual testing tool for debugging MCP servers. It provides an interactive UI for testing your tools, resources, and prompts during development.

#### Installation and Usage

```bash
# Run the inspector directly via npx
npx @modelcontextprotocol/inspector

# Connect to your local MCP server
npx @modelcontextprotocol/inspector http://localhost:8787/mcp
```

#### Features for Development

- **Visual Interface** - Interactive testing of tools with form-based parameter input
- **Request History** - View all requests and responses for debugging
- **Real-time Notifications** - Monitor server events and errors
- **Resource Browser** - Explore and test resource endpoints
- **Tool Testing** - Execute tools with real-time response visualization
- **JSON Visualization** - Pretty-printed request/response data

#### Using with Your MCP Server

1. Start your development server:
   ```bash
   npm run dev
   ```

2. In another terminal, launch the MCP Inspector:
   ```bash
   npx @modelcontextprotocol/inspector
   ```

3. Configure the connection:
   - Set transport to `streamable-http` or `sse`
   - Enter your server URL: `http://localhost:8787/mcp`
   - Add your OAuth token if authentication is enabled

4. Test your tools and debug issues visually

### Local Debugging

1. **Console logs** - Visible in terminal during `npm run dev`
2. **Browser DevTools** - For UI debugging
3. **Database queries** - Log SQL for troubleshooting
4. **MCP Inspector** - Visual testing and debugging of MCP endpoints

### Remote Debugging

```bash
# Tail production logs
wrangler tail

# Filter logs
wrangler tail --format pretty | grep ERROR
```

### CLI Mode for Automated Testing

The MCP Inspector also supports CLI mode for scripting and automation:

```bash
# List available tools
npx @modelcontextprotocol/inspector --cli http://localhost:8787/mcp --method tools/list

# Call a specific tool
npx @modelcontextprotocol/inspector --cli http://localhost:8787/mcp \
  --method tools/call \
  --tool-name myTool \
  --tool-arg param1=value1
```

This is particularly useful for:
- Automated testing in CI/CD pipelines
- Quick debugging without leaving the terminal
- Integration with coding assistants for rapid development

## Common Development Tasks

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update dependencies
npm update

# Update to latest major versions
npm install package@latest
```

### Database Migrations

Currently manual - modify schema in `src/database/schema.ts` and re-run init.

### Adding Environment Variables

1. Add to `.dev.vars` for local development
2. Add to `wrangler.toml` if needed
3. Set production secrets with `wrangler secret put`

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Commit Messages

Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/tooling changes 