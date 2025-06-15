import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Generate a secure client secret and return both plain and hashed versions
 * Use the hashed version for storage in the database
 */
export async function generateSecureClientSecret(): Promise<{ 
  plainSecret: string; 
  hashedSecret: string; 
}> {
  // Generate a cryptographically secure random secret
  const plainSecret = crypto.randomBytes(32).toString('hex');
  
  // Hash the secret with bcrypt for secure storage
  const saltRounds = 12;
  const hashedSecret = await bcrypt.hash(plainSecret, saltRounds);
  
  return {
    plainSecret,
    hashedSecret
  };
}

/**
 * Validate a client secret against its hashed version
 */
export async function validateClientSecret(plainSecret: string, hashedSecret: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainSecret, hashedSecret);
  } catch (error) {
    console.error('Error validating client secret:', error);
    return false;
  }
}

/**
 * Check if a stored secret is already hashed
 */
export function isSecretHashed(secret: string): boolean {
  return secret.startsWith('$2a$') || 
         secret.startsWith('$2b$') || 
         secret.startsWith('$2y$');
}

/**
 * Generate a secure random token for various OAuth purposes
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Validate redirect URI to prevent open redirect attacks
 */
export function validateRedirectUri(uri: string, allowedUris: string[]): boolean {
  try {
    const url = new URL(uri);
    
    // Check if the URI is in the allowed list (exact match)
    if (!allowedUris.includes(uri)) {
      return false;
    }
    
    // Additional security checks
    const isLocalhost = url.hostname === 'localhost' || 
                       url.hostname === '127.0.0.1' || 
                       url.hostname === '::1';
                       
    // Require HTTPS except for localhost
    if (url.protocol !== 'https:' && !isLocalhost) {
      return false;
    }
    
    // Prevent javascript: and data: URIs
    if (url.protocol === 'javascript:' || url.protocol === 'data:') {
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid URL
    return false;
  }
}

/**
 * Security configuration constants
 */
export const SECURITY_CONFIG = {
  // Token lifetimes (in seconds)
  ACCESS_TOKEN_LIFETIME: 3600, // 1 hour
  REFRESH_TOKEN_LIFETIME: 30 * 24 * 60 * 60, // 30 days
  AUTHORIZATION_CODE_LIFETIME: 600, // 10 minutes
  
  // Bcrypt salt rounds
  BCRYPT_SALT_ROUNDS: 12,
  
  // Token lengths
  ACCESS_TOKEN_LENGTH: 32,
  REFRESH_TOKEN_LENGTH: 32,
  AUTHORIZATION_CODE_LENGTH: 32,
  CLIENT_SECRET_LENGTH: 32,
} as const; 