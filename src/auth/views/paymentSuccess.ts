import { UserContext } from "../../types";

export function generatePaymentSuccessPage(params: {
  toolName?: string;
  reason?: string;
  serverName: string;
  userContext?: UserContext;
}) {
  const { toolName, reason, serverName, userContext } = params;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful - ${serverName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .success-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            padding: 40px;
            text-align: center;
        }
        
        .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            font-size: 40px;
            color: white;
        }
        
        .success-title {
            font-size: 28px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 16px;
        }
        
        .success-message {
            font-size: 16px;
            color: #7f8c8d;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        
        .user-info {
            background: #e8f5e8;
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
        
        .tool-info {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        
        .tool-name {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
        }
        
        .tool-description {
            font-size: 14px;
            color: #6c757d;
        }
        
        .next-steps {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            text-align: left;
        }
        
        .next-steps h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1976d2;
            margin-bottom: 8px;
        }
        
        .next-steps p {
            font-size: 14px;
            color: #424242;
            line-height: 1.5;
        }
        
        .actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            display: inline-block;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #6c757d;
            border: 1px solid #dee2e6;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
            color: #495057;
        }
        
        .footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e9ecef;
            font-size: 12px;
            color: #adb5bd;
        }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="success-icon">
            ✓
        </div>
        
        <h1 class="success-title">Payment Successful!</h1>
        
        <p class="success-message">
            Thank you for your payment. You now have access to premium features.
        </p>
        
        ${userContext ? `
        <div class="user-info">
            <div class="user-name">👤 ${userContext.name}</div>
            <div class="user-email">${userContext.email || userContext.username}</div>
        </div>
        ` : ''}
        
        ${toolName ? `
        <div class="tool-info">
            <div class="tool-name">🔧 ${toolName}</div>
            <div class="tool-description">
                ${reason || 'Premium tool access has been activated'}
            </div>
        </div>
        ` : ''}
        
        <div class="next-steps">
            <h3>📋 Next Steps</h3>
            <p>
                You can now return to your MCP client and use the premium features you've purchased. 
                ${toolName ? `Try calling the "${toolName}" tool again to access its premium functionality.` : 'Your premium tools are now available.'}
            </p>
        </div>
        
        <div class="actions">
            <a href="/" class="btn btn-primary">Return to Dashboard</a>
            <a href="/profile" class="btn btn-secondary">View Profile</a>
        </div>
        
        <div class="footer">
            Payment processed securely by Stripe<br>
            ${serverName} - Premium Tools
        </div>
    </div>
</body>
</html>`;
} 