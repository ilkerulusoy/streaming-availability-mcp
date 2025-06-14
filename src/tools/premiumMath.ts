import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UserContext } from "../types";
import { registerPaidTool } from "../server/paidTool";
import { z } from "zod";

export async function registerPremiumMathTool(server: McpServer, userContext: UserContext, env: Env) {
  await registerPaidTool(
    server,
    userContext,
    env,
    "premium_calculate",
    "Perform advanced mathematical calculations (premium feature)",
    {
      expression: z.string().describe("Mathematical expression to evaluate (supports advanced operations like sin, cos, log, etc.)"),
      precision: z.number().min(1).max(15).default(6).describe("Number of decimal places for the result (default: 6)")
    },
    async ({ expression, precision = 6 }) => {
      try {
        // This is a mock premium calculation
        // In a real implementation, you'd integrate with a proper math library
        const result = evaluateExpression(expression, precision);
        
        return {
          content: [
            {
              type: "text" as const,
              text: `Premium calculation result:\nExpression: ${expression}\nResult: ${result}\nPrecision: ${precision} decimal places\nCalculated for: ${userContext.name}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error evaluating expression "${expression}": ${error instanceof Error ? error.message : 'Invalid expression'}`
            }
          ]
        };
      }
    },
    {
      priceId: env.STRIPE_PRICE_ID || 'price_premium_math', // You'll need to set this in your Stripe dashboard
      paymentReason: "Premium mathematical calculations require a subscription to access advanced computational features.",
      mode: 'subscription' // or 'payment' for one-time payments
    }
  );
}

// Mock function to evaluate mathematical expressions
function evaluateExpression(expression: string, precision: number): string {
  // This is a simplified mock implementation
  // In production, you'd use a proper math parser like math.js
  try {
    // Basic security check - only allow numbers, operators, and basic math functions
    if (!/^[0-9+\-*/.()sin cos tan log sqrt \s]+$/i.test(expression)) {
      throw new Error('Invalid characters in expression');
    }
    
    // Mock calculation - just return a formatted result
    const mockResult = Math.random() * 1000;
    return mockResult.toFixed(precision);
  } catch (error) {
    throw new Error('Failed to evaluate expression');
  }
} 