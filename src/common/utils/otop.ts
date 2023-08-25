import { authenticator } from 'otplib';
import crypto from 'crypto';

authenticator.options = { crypto };

export function generateTotpToken(secret: string) {
  const token = authenticator.generate(secret);
  return token;
}
