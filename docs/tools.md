# Adding MCP Tools

This guide covers how to add new MCP tools to your server, both free and paid.

## Available MCP Tools

### Free Tools
- `add` - Basic math operations
- `userInfo` - Get current user information  
- `personalGreeting` - Personalized user greetings
- `generateImage` - AI image generation
- `getUserStats` - User statistics and analytics

### Premium Tools (Paid)
- `premium_calculate` - Advanced mathematical calculations with higher precision

## Adding Free Tools

### 1. Create Tool File

Create a new file in `src/tools/myTool.ts`:

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
    // Tool logic here
    return {
      content: [{
        type: "text",
        text: `Hello ${userContext.name}! You said: ${message}`
      }]
    };
  });
}
```

### 2. Export from Index

Add to `src/tools/index.ts`:

```typescript
export { registerMyTool } from './myTool';
```

### 3. Register in Main

Add to `src/index.ts`:

```typescript
import { registerMyTool } from "./tools";

backend.registerTool(registerMyTool);
```

## Adding Paid Tools

### 1. Create Paid Tool

Create `src/tools/premiumTool.ts`:

```typescript
import { registerPaidTool } from "../server/paidTool";
import { z } from "zod";

export async function registerPremiumAnalyticsTool(
  server: McpServer, 
  userContext: UserContext, 
  env: Env
) {
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
        content: [{ 
          type: "text", 
          text: `Premium report for ${userContext.name}: ${reportType} analysis of ${dataSource}` 
        }]
      };
    },
    {
      priceId: env.STRIPE_PRICE_ID_ANALYTICS,
      paymentReason: "Premium analytics require a subscription.",
      mode: 'subscription' // or 'payment' for one-time
    }
  );
}
```

### 2. Payment Modes

Choose the appropriate payment mode:

```typescript
// One-time payment
mode: 'payment'

// Subscription
mode: 'subscription'

// Usage-based (coming soon)
mode: 'usage'
```

### 3. Register Paid Tool

Same as free tools - add to exports and register in `index.ts`.

## Tool Best Practices

### Input Validation

Use Zod for robust input validation:

```typescript
import { z } from "zod";

const schema = z.object({
  query: z.string().min(1).max(1000),
  limit: z.number().int().positive().default(10),
  filters: z.object({
    category: z.enum(["tech", "science", "business"]).optional(),
    dateRange: z.object({
      from: z.string().datetime(),
      to: z.string().datetime()
    }).optional()
  }).optional()
});
```

### Error Handling

Always handle errors gracefully:

```typescript
async ({ input }) => {
  try {
    // Tool logic
    const result = await performOperation(input);
    return {
      content: [{ type: "text", text: result }]
    };
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error: ${error.message}` 
      }],
      isError: true
    };
  }
}
```

### User Context

Leverage user context for personalization:

```typescript
const { userId, name, email, scopes } = userContext;

// Check permissions
if (!scopes.includes('admin')) {
  return {
    content: [{ 
      type: "text", 
      text: "This tool requires admin permissions" 
    }],
    isError: true
  };
}

// Personalize response
return {
  content: [{ 
    type: "text", 
    text: `Hello ${name}, here are your personalized results...` 
  }]
};
```

## Testing Tools

### Local Testing

1. Start dev server: `npm run dev`
2. Register/login at `http://localhost:8787`
3. Use an MCP client or the `/up` endpoint to test

### Test Paid Tools

For Stripe integration:

1. Use Stripe test mode keys
2. Use test card numbers (e.g., `4242 4242 4242 4242`)
3. Monitor Stripe dashboard for test payments

## Tool Examples

### Database Query Tool

```typescript
export function registerDatabaseQueryTool(
  server: McpServer, 
  userContext: UserContext, 
  env: Env
) {
  server.tool("queryUserData", "Query user-specific data", {
    input: {
      type: "object",
      properties: {
        dataType: { 
          type: "string", 
          enum: ["stats", "history", "preferences"] 
        }
      },
      required: ["dataType"]
    }
  }, async ({ dataType }) => {
    const db = new Database(env);
    const data = await db.getUserData(userContext.userId, dataType);
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify(data, null, 2) 
      }]
    };
  });
}
```

### External API Tool

```typescript
export function registerWeatherTool(
  server: McpServer, 
  userContext: UserContext, 
  env: Env
) {
  server.tool("getWeather", "Get weather for a location", {
    input: {
      type: "object",
      properties: {
        location: { type: "string" }
      },
      required: ["location"]
    }
  }, async ({ location }) => {
    const response = await fetch(
      `https://api.weather.com/v1/current?q=${location}&key=${env.WEATHER_API_KEY}`
    );
    const weather = await response.json();
    
    return {
      content: [{ 
        type: "text", 
        text: `Weather in ${location}: ${weather.description}, ${weather.temp}°C` 
      }]
    };
  });
}
```

## Advanced Features

### Tool Permissions

Control tool access per user:

```typescript
// In your tool
if (!userContext.scopes.includes('premium')) {
  return {
    content: [{ 
      type: "text", 
      text: "Upgrade to premium to use this tool" 
    }],
    isError: true
  };
}
```

### Rate Limiting

Implement rate limiting for expensive operations:

```typescript
const rateLimiter = new Map();

// In your tool
const key = `${userContext.userId}:${toolName}`;
const lastCall = rateLimiter.get(key);
if (lastCall && Date.now() - lastCall < 60000) { // 1 minute
  return {
    content: [{ 
      type: "text", 
      text: "Please wait before using this tool again" 
    }],
    isError: true
  };
}
rateLimiter.set(key, Date.now());
```

## Additional Resources

For more advanced paid tools implementation, including:
- Complete Stripe setup
- Payment flow details
- Subscription management
- Usage-based billing
- Testing with Stripe

Refer to the paid tools section above or check the Stripe documentation at [stripe.com/docs](https://stripe.com/docs). 