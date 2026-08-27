import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ALGORITHM = 'aes-256-gcm';

function getEncryptionKey() {
  const hexKey = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  return Buffer.from(hexKey, 'hex');
}

/**
 * Encrypts clear text string using AES-256-GCM.
 * Returns cipher string in format: "iv:authTag:encryptedData"
 */
export function encrypt(text) {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(12);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error.message);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts "iv:authTag:encryptedData" back to clear text.
 */
export function decrypt(cipherText) {
  if (!cipherText || typeof cipherText !== 'string') return cipherText;
  if (!cipherText.includes(':')) return cipherText; // Return original if unencrypted fallback
  
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 3) return cipherText;
    
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = getEncryptionKey();
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    return '[Decryption Error / Tampered Data]';
  }
}
