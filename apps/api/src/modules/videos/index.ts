import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { db } from '@sme-tv/db';
import { asyncRoute, authenticate, requireAdmin } from '../../middleware/auth.js';
import { slugify } from '../../lib/content.js';
import { videoForm } from './schemas.js';

const router = Router();

router.get(
  '/videos',
  asyncRoute(async (_request, response) => {
    const data = await db.video.findMany({
      where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: 'desc' },
      take: 30,
    });
    response.json({ success: true, data });
  }),
);

router.post(
  '/admin/videos',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = videoForm.parse(request.body);
    const youtubeId =
      input.videoType === 'YOUTUBE'
        ? (input.youtubeId ??
          input.videoUrl?.match(
            /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
          )?.[1])
        : undefined;
    if (input.videoType === 'YOUTUBE' && !youtubeId)
      return response
        .status(400)
        .json({ success: false, message: 'Provide a valid YouTube URL or video ID' });
    const data = await db.video.create({
      data: {
        title: input.title,
        slug: `${slugify(input.title)}-${randomBytes(3).toString('hex')}`,
        description: input.description,
        videoType: input.videoType,
        videoUrl: input.videoType === 'UPLOAD' ? input.videoUrl : null,
        youtubeId,
        thumbnail: input.thumbnail,
        status: input.status,
        isFeatured: input.isFeatured,
        publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
        authorId: request.user!.id,
      },
    });
    response.status(201).json({ success: true, data });
  }),
);

export default router;
