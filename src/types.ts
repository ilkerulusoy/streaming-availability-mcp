export interface UserContext {
  userId: string;
  username: string;
  email: string;
  name: string;
}

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  COOKIE_ENCRYPTION_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_PRICE_ID_FOR_PREMIUM_MATH: string;
  WRANGLER_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE: string;
  BASE_URL: string;
  HYPERDRIVE: any;
  AI: any;
  RAPIDAPI_KEY_STREAMING_AVAILABILITY: string;
} 