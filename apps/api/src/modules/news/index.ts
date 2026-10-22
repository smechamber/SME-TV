import { Router } from 'express';
import { db } from '@sme-tv/db';
import { asyncRoute, authenticate, requireAdmin } from '../../middleware/auth.js';
import { sanitizeArticleHtml, slugify } from '../../lib/content.js';
import { articleForm } from './schemas.js';

const router = Router();

router.get(
  '/news',
  asyncRoute(async (request, response) => {
    const limit = Math.max(1, Math.min(50, Number(request.query.limit) || 12));
    const where = { status: 'PUBLISHED' as const, publishedAt: { lte: new Date() } };
    const [data, total] = await Promise.all([
      db.article.findMany({
        where,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: { category: { select: { name: true } } },
      }),
      db.article.count({ where }),
    ]);
    response.json({ success: true, data, pagination: { total, limit } });
  }),
);

router.get(
  '/news/:slug',
  asyncRoute(async (request, response) => {
    const data = await db.article.findFirst({
      where: {
        slug: String(request.params.slug),
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      include: { category: true },
    });
    if (!data) return response.status(404).json({ success: false, message: 'Article not found' });
    data.content = sanitizeArticleHtml(data.content);
    response.json({ success: true, data });
  }),
);

router.post(
  '/admin/news',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = articleForm.parse(request.body);
    const slug = slugify(input.slug || input.title);
    const category = input.category
      ? await db.category.upsert({
          where: { slug: slugify(input.category) },
          update: {},
          create: { name: input.category, slug: slugify(input.category) },
        })
      : undefined;
    const data = await db.article.create({
      data: {
        title: input.title,
        slug,
        summary: input.summary,
        content: sanitizeArticleHtml(input.content),
        imageUrl: input.imageUrl || null,
        status: input.status,
        isFeatured: input.isFeatured,
        isBreaking: input.isBreaking,
        publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
        authorId: request.user!.id,
        categoryId: category?.id,
      },
    });
    response.status(201).json({ success: true, data });
  }),
);

export default router;
