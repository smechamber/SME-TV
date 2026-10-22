import { Router } from 'express';
import multer from 'multer';
import { db } from '@sme-tv/db';
import { asyncRoute, authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });
const documentTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);

router.get(
  '/admin/stats',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    const [publishedArticles, drafts, videos, upcomingEvents, registrations, users] =
      await Promise.all([
        db.article.count({ where: { status: 'PUBLISHED' } }),
        db.article.count({ where: { status: 'DRAFT' } }),
        db.video.count({ where: { status: 'PUBLISHED' } }),
        db.event.count({ where: { status: 'PUBLISHED', startsAt: { gte: new Date() } } }),
        db.eventRegistration.count(),
        db.user.count(),
      ]);
    response.json({
      success: true,
      data: { publishedArticles, drafts, videos, upcomingEvents, registrations, users },
    });
  }),
);

router.get(
  '/admin/registrations',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const limit = Math.max(1, Math.min(100, Number(request.query.limit) || 50));
    const data = await db.eventRegistration.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { event: { select: { title: true, startsAt: true } } },
    });
    response.json({ success: true, data });
  }),
);

router.post(
  '/admin/media',
  authenticate,
  requireAdmin,
  upload.single('file'),
  asyncRoute(async (request, response) => {
    const file = request.file;
    if (!file) return response.status(400).json({ success: false, message: 'File is required' });
    const resourceType = file.mimetype.startsWith('video/')
      ? 'video'
      : file.mimetype.startsWith('image/')
        ? 'image'
        : documentTypes.has(file.mimetype)
          ? 'document'
          : null;
    if (!resourceType)
      return response.status(415).json({ success: false, message: 'Unsupported file type' });
    const maximumSize =
      resourceType === 'video'
        ? 100 * 1024 * 1024
        : resourceType === 'document'
          ? 20 * 1024 * 1024
          : 10 * 1024 * 1024;
    if (file.size > maximumSize)
      return response.status(413).json({ success: false, message: 'File is too large' });

    const mediaBaseUrl = process.env.MEDIA_SERVER_URL;
    const mediaSecret = process.env.MEDIA_SERVER_SECRET;
    if (!mediaBaseUrl || !mediaSecret)
      return response
        .status(503)
        .json({ success: false, message: 'Media service is not configured' });
    const form = new FormData();
    form.append(
      'file',
      new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
      file.originalname,
    );
    const mediaPath = process.env.MEDIA_UPLOAD_PATH ?? '/api/v1/upload';
    const upstream = await fetch(`${mediaBaseUrl.replace(/\/$/, '')}${mediaPath}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${mediaSecret}`, 'X-Media-Secret': mediaSecret },
      body: form,
    });
    const payload = (await upstream.json().catch(() => null)) as {
      data?: Record<string, unknown>;
      secureUrl?: string;
      url?: string;
      id?: string;
      publicId?: string;
      resourceType?: string;
      message?: string;
    } | null;
    if (!upstream.ok)
      return response
        .status(upstream.status)
        .json({ success: false, message: payload?.message ?? 'Media service rejected the upload' });
    const result = payload?.data ?? payload;
    const url = typeof result?.secureUrl === 'string' ? result.secureUrl : result?.url;
    if (!url)
      return response
        .status(502)
        .json({ success: false, message: 'Media service returned no file URL' });
    response.status(201).json({
      success: true,
      data: {
        url,
        publicId: result?.id ?? result?.publicId ?? null,
        resourceType: result?.resourceType ?? resourceType,
      },
    });
  }),
);

export default router;
