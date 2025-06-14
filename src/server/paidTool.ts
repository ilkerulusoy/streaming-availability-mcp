import { registerPaidTool as registerPaidToolStripe } from '@stripe/agent-toolkit/modelcontextprotocol';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ZodRawShape } from 'zod';
import { UserContext } from "../types";

interface SimplePaidToolOptions {
  priceId: string;
  paymentReason?: string;
  mode?: 'payment' | 'subscription';
  meterEvent?: string;
}

/**
 * Simplified wrapper around Stripe's registerPaidTool that auto-sets common parameters
 * from the authenticated user context and environment
 */
export async function registerPaidTool<T extends ZodRawShape>(
  server: McpServer,
  userContext: UserContext,
  env: Env,
  toolName: string,
  description: string,
  params: T,
  callback: ToolCallback<T>,
  options: SimplePaidToolOptions
) {
  // Auto-set common parameters using the official Stripe agent toolkit
  return registerPaidToolStripe(
    server,
    toolName,
    description,
    params,
    callback,
    {
      paymentReason: options.paymentReason || `You must complete payment to use the ${toolName} tool.`,
      stripeSecretKey: env.STRIPE_SECRET_KEY,
      userEmail: userContext.email || userContext.username,
      meterEvent: options.meterEvent,
      checkout: {
        mode: options.mode || 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: options.priceId,
            quantity: 1,
          },
        ],
        success_url: `${env.BASE_URL}/payment-success?tool=${toolName}`,
        cancel_url: `${env.BASE_URL}/payment-cancelled?tool=${toolName}`,
      }
    }
  );
} 