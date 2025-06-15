# Deployment Guide

This guide covers deploying your MCP server to production on Cloudflare Workers.

## Production Deployment

### 1. Set Production Secrets

Set each secret securely (you'll be prompted to enter values):

```bash
# Security secrets
wrangler secret put JWT_SECRET
wrangler secret put COOKIE_ENCRYPTION_KEY

# Stripe secrets (for paid tools)
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_PRICE_ID_FOR_PREMIUM_MATH

# Database URL
wrangler secret put DATABASE_URL
```

### 2. Deploy to Cloudflare

```bash
npm run deploy
```

### 3. Initialize Production Database

```bash
# Replace with your actual worker URL
curl -X POST https://your-worker.your-subdomain.workers.dev/init-db
```

### 4. Update OAuth Settings

Update any OAuth client redirect URIs to use your production URL.

## Custom Domain (Optional)

To use a custom domain instead of the default `.workers.dev` URL:

1. In Cloudflare dashboard, go to Workers & Pages
2. Select your worker
3. Go to Settings → Triggers
4. Add custom domain

## MCP Endpoints

Your deployed server provides these endpoints:

- `POST /mcp` - Main MCP endpoint (requires OAuth)
- `GET /up` - Health check and server info
- `GET /payment-success` - Payment confirmation page
- `GET /payment-cancelled` - Payment cancelled page
- `POST /init-db` - Initialize database (run once)

## Using Your MCP Server

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

## Security Considerations

1. **Always use HTTPS** - Cloudflare Workers automatically provide this
2. **Keep secrets secure** - Never commit secrets to git
3. **Rotate keys regularly** - Update JWT secrets periodically
4. **Monitor usage** - Check Cloudflare analytics for unusual activity
5. **Enable rate limiting** - Use Cloudflare's rate limiting features

## Monitoring and Logs

### Cloudflare Dashboard

1. Go to your Cloudflare dashboard
2. Navigate to Workers & Pages
3. Select your worker
4. View:
   - Real-time logs
   - Analytics
   - Error rates
   - Request patterns

### Wrangler Tail

Monitor logs in real-time:

```bash
wrangler tail
```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Verify DATABASE_URL is correct
   - Check if database is accessible from Cloudflare
   - Consider using Hyperdrive for better connectivity

2. **OAuth errors**
   - Ensure JWT_SECRET matches between deployments
   - Check redirect URIs are updated
   - Verify cookie domain settings

3. **Stripe payment issues**
   - Confirm Stripe keys are for the correct environment
   - Check webhook endpoints if using them
   - Verify price IDs match your Stripe dashboard

## Environment Variables

Production environment variables to set:

```bash
# Required
DATABASE_URL              # PostgreSQL connection string
JWT_SECRET               # Strong secret for JWT signing
COOKIE_ENCRYPTION_KEY    # 32-character encryption key
BASE_URL                 # Your production URL

# For paid tools
STRIPE_SECRET_KEY        # Stripe secret key
STRIPE_PRICE_ID_*        # Price IDs for paid tools
```

## Next Steps

- Set up monitoring alerts
- Configure custom error pages
- Enable Cloudflare analytics
- Set up backup procedures
- Plan for scaling if needed 