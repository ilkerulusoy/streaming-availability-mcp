# Paid Tools Guide

This guide explains how to add payment-required tools to your MCP server using Stripe integration.

## Setup

### 1. Environment Variables

Add these to your `.dev.vars` file:

```bash
# Stripe Configuration (for paid tools)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_PRICE_ID="price_your_stripe_price_id_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
BASE_URL="https://your-worker-domain.workers.dev"
```

### 2. Stripe Setup

1. Create a [Stripe account](https://stripe.com) and get your secret key
2. Create a product and price in your Stripe dashboard
3. Set up webhooks for payment completion (optional but recommended)

## Creating a Paid Tool

### Example Implementation

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UserContext } from "../types";
import { registerPaidToolSimple } from "../server/paidToolHelper";
import { z } from "zod";

export async function registerPremiumAnalyticsTool(server: McpServer, userContext: UserContext, env: Env) {
  await registerPaidToolSimple(
    server,
    userContext,
    env,
    "premium_analytics",
    "Generate advanced analytics reports with AI insights",
    {
      dataSource: z.string().describe("The data source to analyze"),
      reportType: z.enum(["summary", "detailed", "predictive"]).describe("Type of analytics report"),
      timeRange: z.string().default("30d").describe("Time range for analysis (e.g., '7d', '30d', '1y')")
    },
    async ({ dataSource, reportType, timeRange }) => {
      // Your premium tool logic here
      const report = await generateAdvancedReport(dataSource, reportType, timeRange);
      
      return {
        content: [
          {
            type: "text" as const,
            text: `Premium Analytics Report:\n${report}\n\nGenerated for: ${userContext.name}`
          }
        ]
      };
    },
    {
      priceId: env.STRIPE_PRICE_ID || 'price_premium_analytics',
      paymentReason: "Premium analytics require a subscription to access advanced AI-powered insights.",
      mode: 'subscription' // or 'payment' for one-time payments
    }
  );
}
```

### Register the Tool

Add your paid tool to the main server configuration in `src/index.ts`:

```typescript
// Import your tool
import { registerPremiumAnalyticsTool } from "./tools/premiumAnalytics";

// Register it with the backend
backend
  .registerTool(registerPremiumAnalyticsTool);
```

## Payment Flow

### 1. Tool Call Without Payment

When a user calls a paid tool without having paid:

```json
{
  "status": "payment_required",
  "data": {
    "paymentType": "oneTimeSubscription",
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_...",
    "paymentReason": "Premium analytics require a subscription..."
  }
}
```

### 2. Payment Process

1. User is redirected to Stripe Checkout
2. After successful payment, user is redirected to `/payment-success?tool=premium_analytics`
3. A beautiful success page is displayed with next steps

### 3. Tool Access

After payment, the tool functions normally and returns the actual results.

## Payment Options

### One-time Payment

```typescript
{
  priceId: "price_one_time_feature",
  mode: 'payment'
}
```

### Subscription

```typescript
{
  priceId: "price_monthly_subscription",
  mode: 'subscription'
}
```

### Usage-based Billing

```typescript
{
  priceId: "price_usage_based",
  mode: 'subscription',
  meterEvent: 'api_call' // Stripe billing meter event name
}
```

## Customization

### Custom Payment Reason

```typescript
{
  priceId: env.STRIPE_PRICE_ID,
  paymentReason: "This premium feature requires a one-time payment of $9.99 to unlock advanced capabilities.",
  mode: 'payment'
}
```

### Auto-set Parameters

The `registerPaidToolSimple` wrapper automatically sets:

- `userEmail`: From authenticated user context
- `stripeSecretKey`: From environment variables
- `successUrl`: Points to `/payment-success?tool={toolName}`
- `cancelUrl`: Points to `/payment-cancelled?tool={toolName}`

## Payment Pages

### Success Page

Located at `/payment-success`, this page:
- Shows payment confirmation
- Displays the tool name and description
- Provides next steps for the user
- Includes navigation back to the dashboard

### Cancelled Page

Located at `/payment-cancelled`, this page shows when payment is cancelled.

## Security Notes

1. Always validate payments server-side
2. Use Stripe webhooks to handle payment events
3. Store payment status in your database for production use
4. The current implementation checks Stripe directly - consider caching for better performance

## Testing

Use Stripe's test mode:
1. Use test secret keys (`sk_test_...`)
2. Use test price IDs
3. Use test webhook endpoints
4. Test with Stripe's test card numbers

## Production Considerations

1. Implement proper payment status caching in your database
2. Set up Stripe webhooks for real-time payment updates  
3. Add proper error handling and retry logic
4. Consider rate limiting for paid tools
5. Implement usage tracking for metered billing

## Example Tools Included

- `premium_calculate`: Advanced mathematical calculations requiring subscription
- Payment success/cancel pages with beautiful UI

## Support

For issues:
1. Check Stripe dashboard for payment logs
2. Review server logs for tool execution
3. Verify environment variables are set correctly
4. Test with Stripe's test mode first 