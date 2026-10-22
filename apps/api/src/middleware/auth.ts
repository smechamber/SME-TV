import type { NextFunction, Request, Response } from 'express';
import { db } from '@sme-tv/db';
import { hashToken } from '../lib/content.js';

export type AuthRequest = Request & { user?: { id: string; role: string } };

const attempts = new Map<string, { count: number; resetAt: number }>();

export function authRateLimit(request: Request, response: Response, next: NextFunction) {
  const key = request.ip || 'unknown';
  const now = Date.now();
  const window = attempts.get(key);
  if (!window || window.resetAt <= now) attempts.set(key, { count: 1, resetAt: now + 60_000 });
  else if (window.count >= 10)
    return response
      .status(429)
      .json({ success: false, message: 'Too many attempts. Try again in a minute.' });
  else window.count++;
  next();
}

export async function authenticate(request: AuthRequest, response: Response, next: NextFunction) {
  try {
    const token = request.header('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return response.status(401).json({ success: false, message: 'Sign in required' });
    const session = await db.session.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { user: true },
    });
    if (!session || session.expiresAt <= new Date() || session.user.status !== 'ACTIVE')
      return response.status(401).json({ success: false, message: 'Session expired' });
    request.user = { id: session.user.id, role: session.user.role };
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(request: AuthRequest, response: Response, next: NextFunction) {
  if (!request.user || !['ADMIN', 'EDITOR'].includes(request.user.role))
    return response.status(403).json({ success: false, message: 'Administrator access required' });
  next();
}

export function asyncRoute(
  handler: (request: AuthRequest, response: Response) => Promise<unknown>,
) {
  return (request: Request, response: Response, next: NextFunction) =>
    Promise.resolve(handler(request as AuthRequest, response)).catch(next);
}
