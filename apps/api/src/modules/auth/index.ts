import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { db } from '@sme-tv/db';
import { asyncRoute, authRateLimit, authenticate } from '../../middleware/auth.js';
import { hashToken } from '../../lib/content.js';

const router = Router();
const credentials = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function passwordMatches(password: string, storedHash?: string | null) {
  const [salt, expected] = storedHash?.split(':') ?? ['', ''];
  const actual = scryptSync(password, salt || 'invalid', 64).toString('hex');
  return (
    expected.length === actual.length &&
    timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'))
  );
}

async function createSession(userId: string, durationMs: number) {
  const token = randomBytes(32).toString('base64url');
  await db.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + durationMs) },
  });
  return token;
}

router.post(
  '/auth/register',
  authRateLimit,
  asyncRoute(async (request, response) => {
    const input = z
      .object({
        name: z.string().trim().min(2).max(120),
        email: z.string().trim().email().max(254),
        password: z.string().min(10).max(128),
      })
      .parse(request.body);
    const salt = randomBytes(16).toString('hex');
    const passwordHash = `${salt}:${scryptSync(input.password, salt, 64).toString('hex')}`;
    const user = await db.user.create({
      data: { name: input.name, email: input.email.toLowerCase(), passwordHash },
    });
    response
      .status(201)
      .json({ success: true, data: { id: user.id, name: user.name, email: user.email } });
  }),
);

router.post(
  '/auth/login',
  authRateLimit,
  asyncRoute(async (request, response) => {
    const input = credentials.parse(request.body);
    const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user || !passwordMatches(input.password, user.passwordHash) || user.status !== 'ACTIVE')
      return response.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = await createSession(user.id, 14 * 24 * 60 * 60 * 1000);
    response.json({
      success: true,
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  }),
);

router.post(
  '/admin/login',
  authRateLimit,
  asyncRoute(async (request, response) => {
    const input = credentials.parse(request.body);
    const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (
      !user ||
      !passwordMatches(input.password, user.passwordHash) ||
      user.status !== 'ACTIVE' ||
      !['ADMIN', 'EDITOR'].includes(user.role)
    )
      return response
        .status(401)
        .json({ success: false, message: 'Invalid admin email or password' });
    const token = await createSession(user.id, ADMIN_SESSION_TTL_MS);
    response.json({
      success: true,
      data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  }),
);

router.post(
  '/auth/logout',
  authenticate,
  asyncRoute(async (request, response) => {
    const token = request.header('authorization')!.replace(/^Bearer\s+/i, '');
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
    response.json({ success: true });
  }),
);

export default router;
