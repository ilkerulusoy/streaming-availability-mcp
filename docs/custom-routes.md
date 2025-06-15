# Custom Routes Framework

This framework includes a powerful custom routes system that makes it easy to add REST API endpoints alongside your MCP tools.

## Overview

The custom routes framework allows you to:
- Add public routes (no authentication required)
- Add protected routes (OAuth authentication required)
- Handle different HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Access request data (headers, body, query params)
- Return various response types (JSON, HTML, redirects)

## Public Routes

Public routes don't require authentication and are accessible to anyone.

### Basic Examples

```typescript
// GET endpoint
backend.route('GET', '/api/status', (c) => {
  return c.json({ status: 'operational', version: '1.0.0' });
});

// POST endpoint with body parsing
backend.route('POST', '/api/webhook', async (c) => {
  const payload = await c.req.json();
  // Process webhook
  return c.json({ received: true, processed: payload });
});

// Query parameters
backend.route('GET', '/api/search', (c) => {
  const query = c.req.query('q');
  const limit = c.req.query('limit') || '10';
  return c.json({ 
    query, 
    limit: parseInt(limit),
    results: [] 
  });
});
```

## Protected Routes

Protected routes require a valid OAuth token and automatically provide user context.

### Basic Examples

```typescript
// Protected GET endpoint
backend.authRoute('GET', '/api/user/profile', (c, userContext, env) => {
  // userContext contains: { userId, name, username, email, scopes }
  return c.json({
    user: userContext,
    message: `Welcome, ${userContext.name}!`
  });
});

// Protected POST with database access
backend.authRoute('POST', '/api/user/settings', async (c, userContext, env) => {
  const settings = await c.req.json();
  
  // Save to database
  const db = new Database(env);
  await db.updateUserSettings(userContext.userId, settings);
  
  return c.json({ 
    success: true,
    message: 'Settings updated'
  });
});
```

## Route Handler Reference

### Context Object (`c`)

The context object provides access to request and response utilities:

```typescript
// Request properties
c.req.method      // HTTP method
c.req.url         // Full URL
c.req.path        // URL path
c.req.headers     // Request headers
c.req.query(key)  // Query parameter
c.req.param(key)  // URL parameter
await c.req.json()      // Parse JSON body
await c.req.text()      // Get text body
await c.req.formData()  // Parse form data

// Response methods
c.json(data)           // JSON response
c.text(text)           // Text response
c.html(html)           // HTML response
c.redirect(url)        // Redirect response
c.status(code)         // Set status code
c.header(key, value)   // Set header
```

### User Context (Protected Routes)

```typescript
interface UserContext {
  userId: string;
  name: string;
  username: string;
  email: string;
  scopes: string[];
}
```

## Advanced Examples

### File Upload

```typescript
backend.authRoute('POST', '/api/upload', async (c, userContext, env) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }
  
  // Process file
  const buffer = await file.arrayBuffer();
  const filename = `${userContext.userId}/${file.name}`;
  
  // Store file (example with R2)
  await env.BUCKET.put(filename, buffer);
  
  return c.json({ 
    success: true,
    filename,
    size: buffer.byteLength
  });
});
```

### Streaming Response

```typescript
backend.route('GET', '/api/stream', (c) => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`Data chunk ${i}\n`));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain' }
  });
});
```

### Error Handling

```typescript
backend.authRoute('GET', '/api/user/:id', async (c, userContext, env) => {
  try {
    const userId = c.req.param('id');
    
    // Check permissions
    if (userId !== userContext.userId && !userContext.scopes.includes('admin')) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    
    const db = new Database(env);
    const user = await db.getUser(userId);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
```

### CORS Headers

```typescript
backend.route('OPTIONS', '/api/*', (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
});
```

## Middleware

You can add middleware to routes for common functionality:

```typescript
// Logging middleware
const logger = async (c: Context, next: Function) => {
  console.log(`${c.req.method} ${c.req.path}`);
  await next();
};

// Rate limiting middleware
const rateLimiter = async (c: Context, next: Function) => {
  // Implement rate limiting logic
  await next();
};

// Use in routes
backend.use('*', logger);
backend.use('/api/*', rateLimiter);
```

## Best Practices

### 1. RESTful Design

Follow REST conventions:
```typescript
backend.route('GET', '/api/items', listItems);        // List
backend.route('GET', '/api/items/:id', getItem);      // Get one
backend.route('POST', '/api/items', createItem);      // Create
backend.route('PUT', '/api/items/:id', updateItem);   // Update
backend.route('DELETE', '/api/items/:id', deleteItem); // Delete
```

### 2. Input Validation

Always validate input:
```typescript
backend.authRoute('POST', '/api/items', async (c, userContext, env) => {
  const body = await c.req.json();
  
  // Validate with Zod
  const schema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    price: z.number().positive()
  });
  
  try {
    const data = schema.parse(body);
    // Process validated data
  } catch (error) {
    return c.json({ error: 'Invalid input', details: error.errors }, 400);
  }
});
```

### 3. Consistent Responses

Use consistent response formats:
```typescript
// Success response
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation completed"
}

// Error response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### 4. Documentation

Document your API endpoints:
```typescript
/**
 * Get user profile
 * @route GET /api/user/profile
 * @auth Required
 * @returns {UserProfile} User profile data
 */
backend.authRoute('GET', '/api/user/profile', async (c, userContext, env) => {
  // Implementation
});
```

## Integration with MCP Tools

Routes can work alongside MCP tools:

```typescript
// Route that triggers an MCP tool
backend.authRoute('POST', '/api/analyze', async (c, userContext, env) => {
  const { data } = await c.req.json();
  
  // Use the same logic as your MCP tool
  const result = await analyzeData(data, userContext);
  
  return c.json({ result });
});
```

This makes it easy to create complete applications with both MCP tools and traditional REST APIs! 