import { Router } from 'express';
import { z } from 'zod';
import { db } from '@sme-tv/db';
import { asyncRoute, authenticate } from '../../middleware/auth.js';

const router = Router();

router.get(
  '/auth/me',
  authenticate,
  asyncRoute(async (request, response) => {
    const user = await db.user.findUnique({
      where: { id: request.user!.id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });
    response.json({ success: true, data: user });
  }),
);

router.put(
  '/auth/me',
  authenticate,
  asyncRoute(async (request, response) => {
    const input = z
      .object({
        name: z.string().trim().min(2).max(120),
        phone: z
          .string()
          .trim()
          .regex(/^\+?[0-9 ()-]{8,20}$/)
          .optional(),
      })
      .parse(request.body);
    const user = await db.user.update({
      where: { id: request.user!.id },
      data: input,
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
    response.json({ success: true, data: user });
  }),
);

export default router;
