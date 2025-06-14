import { McpBackend } from "./server";
import {
  registerMeTool,
  registerGreetingTool,
  registerAddTool,
  registerGenerateImageTool,
  registerSearchTool,
  registerFetchTool,
  registerPremiumMathTool,
} from "./tools";
import { generatePaymentSuccessPage } from "./auth/views";

// Create the MCP server framework
const backend = new McpBackend({
  name: "Custom OAuth MCP Server",
  version: "1.0.0"
});

// Register all tools
backend
  .registerTool(registerMeTool)
  .registerTool(registerGreetingTool)
  .registerTool(registerAddTool)
  .registerTool(registerGenerateImageTool)
  // OpenAI compatible tools
  .registerTool(registerSearchTool)
  .registerTool(registerFetchTool)
  // Premium tools
  .registerTool(registerPremiumMathTool);

// Register custom static routes (no authentication required)
backend
  .route('GET', '/api/ping', (c) => {
    return c.json({ message: 'pong', timestamp: new Date().toISOString() });
  })
  .route('POST', '/api/echo', async (c) => {
    const body = await c.req.json();
    return c.json({ echo: body, timestamp: new Date().toISOString() });
  })
  .authRoute('GET', '/payment-success', (c, userContext, env) => {
    const toolName = c.req.query('tool');
    const reason = c.req.query('reason');
    
    const html = generatePaymentSuccessPage({
      toolName,
      reason,
      serverName: "Custom OAuth MCP Server",
      userContext
    });
    
    return c.html(html);
  })
  .authRoute('GET', '/payment-cancelled', (c, userContext, env) => {
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Cancelled</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            margin: 0;
          }
          .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            padding: 40px;
            text-align: center;
          }
          .icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            font-size: 40px;
            color: white;
          }
          .title {
            font-size: 28px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 16px;
          }
          .message {
            font-size: 16px;
            color: #7f8c8d;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .user-info {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
          }
          .user-name {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
          }
          .user-email {
            font-size: 14px;
            color: #6c757d;
          }
          .btn {
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: inline-block;
            transition: all 0.3s ease;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✗</div>
          <h1 class="title">Payment Cancelled</h1>
          <p class="message">
            Your payment was cancelled. No charges were made to your account.
          </p>
          <div class="user-info">
            <div class="user-name">👤 ${userContext.name}</div>
            <div class="user-email">${userContext.email || userContext.username}</div>
          </div>
          <p class="message">
            You can try again later or contact support if you need assistance.
          </p>
          <a href="/" class="btn">Return to Dashboard</a>
        </div>
      </body>
      </html>
    `);
  });

// Register custom authenticated routes (OAuth token required)
backend
  .authRoute('GET', '/api/profile', (c, userContext, env) => {
    return c.json({
      message: 'User profile data',
      user: userContext,
      timestamp: new Date().toISOString()
    });
  })
  .authRoute('GET', '/profile', (c, userContext, env) => {
    return c.html('Hello, ' + userContext.name);
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

// Export the configured app
export default backend.getApp();
