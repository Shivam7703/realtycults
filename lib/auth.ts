// Path: lib/auth.ts
import crypto from 'crypto';

export const COOKIE_NAME = 'admin_session';
export const SESSION_SECONDS: number = 60 * 60 * 24 * 7; // 7 din

function sign(payload: string): string {
  return crypto.createHmac('sha256', process.env.API_KEY ?? '').update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/** Login ke time diya gaya key sahi hai ya nahi */
export function checkKey(input: unknown): boolean {
  const key = process.env.API_KEY;
  return !!key && typeof input === 'string' && safeEqual(input, key);
}

/** Cookie me jaane wala token: "<expiry>.<signature>" (raw key kabhi nahi) */
export function createSessionToken(): string {
  const exp: number = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return `${exp}.${sign(`admin:${exp}`)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !process.env.API_KEY) return false;
  const [expStr, sig] = token.split('.');
  const exp: number = Number(expStr);
  if (!exp || !sig || exp < Date.now() / 1000) return false;
  return safeEqual(sig, sign(`admin:${exp}`));
}