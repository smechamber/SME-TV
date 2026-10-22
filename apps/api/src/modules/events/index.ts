import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { db } from '@sme-tv/db';
import { asyncRoute, authRateLimit, authenticate, requireAdmin } from '../../middleware/auth.js';
import { slugify } from '../../lib/content.js';
import { eventForm, registrationForm } from './schemas.js';

const router = Router();

router.get(
  '/events',
  asyncRoute(async (_request, response) => {
    const data = await db.event.findMany({
      where: { status: 'PUBLISHED', startsAt: { gte: new Date() } },
      orderBy: { startsAt: 'asc' },
      take: 30,
    });
    response.json({ success: true, data });
  }),
);

router.post(
  '/admin/events',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = eventForm.parse(request.body);
    const data = await db.event.create({
      data: {
        ...input,
        slug: `${slugify(input.title)}-${randomBytes(3).toString('hex')}`,
        imageUrl: input.imageUrl || null,
        startsAt: new Date(input.startsAt),
        endsAt: input.endsAt ? new Date(input.endsAt) : null,
        registrationClose: input.registrationClose ? new Date(input.registrationClose) : null,
      },
    });
    response.status(201).json({ success: true, data });
  }),
);

router.post(
  '/events/:id/register',
  authRateLimit,
  asyncRoute(async (request, response) => {
    const input = registrationForm.parse(request.body);
    const event = await db.event.findFirst({
      where: { id: String(request.params.id), status: 'PUBLISHED', startsAt: { gte: new Date() } },
    });
    if (!event || (event.registrationClose && event.registrationClose < new Date()))
      return response
        .status(404)
        .json({ success: false, message: 'Registration is closed for this event' });
    const count = await db.eventRegistration.count({ where: { eventId: event.id } });
    if (event.capacity && count >= event.capacity)
      return response
        .status(409)
        .json({ success: false, message: 'This event has reached capacity' });
    const data = await db.eventRegistration.create({ data: { ...input, eventId: event.id } });
    response
      .status(201)
      .json({ success: true, data: { id: data.id, message: 'Registration received' } });
  }),
);

export default router;
