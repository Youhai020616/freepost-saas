/**
 * Cryptographic utilities for sensitive data encryption
 *
 * Encrypts/decrypts sensitive tokens (OAuth tokens, API keys) at rest.
 * Uses AES-256-GCM with AUTH_SECRET as the encryption key.
 *
 * Usage:
 *   import { encryptToken, decryptToken } from '@/lib/crypto';
 *
 *   const encrypted = await encryptToken('sensitive-access-token');
 *   const decrypted = await decryptToken(encrypted);
 */

import { env } from './env';
import { logger } from './logger';

/**
 * Derive encryption key from AUTH_SECRET
 * Uses SHA-256 to create a consistent 256-bit key
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(env.AUTH_SECRET);

  // Hash the secret to get a consistent 256-bit key
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyMaterial);

  // Import as AES-GCM key
  return crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random initialization vector
 */
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

/**
 * Encrypt a string using AES-256-GCM
 *
 * @param plaintext - The string to encrypt
 * @returns Base64-encoded encrypted data with IV prepended
 */
export async function encryptToken(plaintext: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const iv = generateIV();
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64
    return Buffer.from(combined).toString('base64');
  } catch (error) {
    logger.error('Encryption failed', { error });
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt a string using AES-256-GCM
 *
 * @param ciphertext - Base64-encoded encrypted data
 * @returns Decrypted plaintext string
 */
export async function decryptToken(ciphertext: string): Promise<string> {
  try {
    const key = await getEncryptionKey();

    // Decode from base64
    const combined = Buffer.from(ciphertext, 'base64');

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encrypted
    );

    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    logger.error('Decryption failed', { error });
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Hash a string using SHA-256
 * Useful for one-way hashing (e.g., verification tokens)
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(hashBuffer).toString('hex');
}

/**
 * Generate a cryptographically secure random string
 *
 * @param length - Length of the random string (default: 32)
 * @returns Random hex string
 */
export function generateRandomString(length = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Buffer.from(bytes).toString('hex');
}

/**
 * Constant-time string comparison
 * Prevents timing attacks when comparing secrets
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  return crypto.timingSafeEqual(bufferA, bufferB);
}
