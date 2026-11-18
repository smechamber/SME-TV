import { Router } from 'express';
import { z } from 'zod';
import { db } from '@sme-tv/db';
import { asyncRoute, authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();
const slots = [
  'HOMEPAGE_TOP',
  'HOMEPAGE_MIDDLE',
  'HOMEPAGE_BOTTOM',
  'ARTICLE_TOP',
  'ARTICLE_MIDDLE',
  'ARTICLE_BOTTOM',
  'ARTICLE_SIDEBAR',
  'VIDEO_TOP',
  'VIDEO_MIDDLE',
  'VIDEO_BOTTOM',
  'VIDEO_SIDEBAR',
  'NEWS_LIST_TOP',
  'VIDEO_LIST_TOP',
  'NEWS_SEARCH_TOP',
  'NEWS_SEARCH_BOTTOM',
  'NEWS_EVENTS_TOP',
  'NEWS_EVENTS_BOTTOM',
  'NEWS_ARCHIVES_TOP',
  'NEWS_ARCHIVES_BOTTOM',
  'VIDEOS_SEARCH_TOP',
  'VIDEOS_SEARCH_BOTTOM',
  'VIDEOS_EVENTS_TOP',
  'VIDEOS_EVENTS_BOTTOM',
  'VIDEOS_ARCHIVES_TOP',
  'VIDEOS_ARCHIVES_BOTTOM',
  'FOOTER',
] as const;
const slotSchema = z.enum(slots);
const idList = z
  .array(z.string().min(1))
  .max(10000)
  .transform((ids) => [...new Set(ids)]);
const advertisementSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    imageUrl: z.string().url().max(2048),
    redirectUrl: z
      .string()
      .url()
      .max(2048)
      .refine((value) => /^https?:\/\//i.test(value)),
    enabled: z.boolean().default(true),
    locations: z
      .array(slotSchema)
      .min(1)
      .max(slots.length)
      .transform((values) => [...new Set(values)]),
    articleTargetMode: z.enum(['ALL', 'SELECTED']).default('ALL'),
    articleIds: idList.default([]),
    videoTargetMode: z.enum(['ALL', 'SELECTED']).default('ALL'),
    videoIds: idList.default([]),
    sidebarPosition: z.enum(['LEFT', 'RIGHT', 'BOTH']).default('BOTH'),
  })
  .superRefine((value, context) => {
    if (
      value.locations.some((location) => location.startsWith('ARTICLE_')) &&
      value.articleTargetMode === 'SELECTED' &&
      !value.articleIds.length
    )
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['articleIds'],
        message: 'Select at least one article.',
      });
    if (
      value.locations.some((location) => location.startsWith('VIDEO_')) &&
      value.videoTargetMode === 'SELECTED' &&
      !value.videoIds.length
    )
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['videoIds'],
        message: 'Select at least one video.',
      });
  });

const includeTargets = {
  articles: { include: { article: { select: { id: true, title: true, publishedAt: true } } } },
  videos: { include: { video: { select: { id: true, title: true, publishedAt: true } } } },
} as const;

router.get(
  '/admin/ad-targets',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    const [articles, videos] = await Promise.all([
      db.article.findMany({
        where: { status: 'PUBLISHED', publishedAt: { not: null, lte: new Date() } },
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, publishedAt: true },
      }),
      db.video.findMany({
        where: { status: 'PUBLISHED', publishedAt: { not: null, lte: new Date() } },
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, publishedAt: true },
      }),
    ]);
    response.json({ success: true, data: { articles, videos } });
  }),
);

router.get(
  '/admin/advertisements',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    const data = await db.advertisement.findMany({
      include: includeTargets,
      orderBy: { createdAt: 'desc' },
    });
    response.json({ success: true, data, slots });
  }),
);

router.post(
  '/admin/advertisements',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = advertisementSchema.parse(request.body);
    const data = await db.advertisement.create({
      data: {
        name: input.name,
        imageUrl: input.imageUrl,
        redirectUrl: input.redirectUrl,
        enabled: input.enabled,
        locations: input.locations,
        articleTargetMode: input.articleTargetMode,
        videoTargetMode: input.videoTargetMode,
        sidebarPosition: input.sidebarPosition,
        articles: {
          create: input.articleIds.map((articleId) => ({
            article: { connect: { id: articleId } },
          })),
        },
        videos: {
          create: input.videoIds.map((videoId) => ({ video: { connect: { id: videoId } } })),
        },
      },
      include: includeTargets,
    });
    response.status(201).json({ success: true, data });
  }),
);

router.patch(
  '/admin/advertisements/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = advertisementSchema.parse(request.body);
    const id = String(request.params.id);
    const data = await db.advertisement.update({
      where: { id },
      data: {
        name: input.name,
        imageUrl: input.imageUrl,
        redirectUrl: input.redirectUrl,
        enabled: input.enabled,
        locations: input.locations,
        articleTargetMode: input.articleTargetMode,
        videoTargetMode: input.videoTargetMode,
        sidebarPosition: input.sidebarPosition,
        articles: {
          deleteMany: {},
          create: input.articleIds.map((articleId) => ({
            article: { connect: { id: articleId } },
          })),
        },
        videos: {
          deleteMany: {},
          create: input.videoIds.map((videoId) => ({ video: { connect: { id: videoId } } })),
        },
      },
      include: includeTargets,
    });
    response.json({ success: true, data });
  }),
);

router.patch(
  '/admin/advertisements/:id/enabled',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = z.object({ enabled: z.boolean() }).parse(request.body);
    const data = await db.advertisement.update({
      where: { id: String(request.params.id) },
      data: { enabled: input.enabled },
      select: { id: true, enabled: true },
    });
    response.json({ success: true, data });
  }),
);

router.delete(
  '/admin/advertisements/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    await db.advertisement.delete({ where: { id: String(request.params.id) } });
    response.status(204).send();
  }),
);

router.get(
  '/ads',
  asyncRoute(async (request, response) => {
    const requestedSlots = String(request.query.slots ?? request.query.slot ?? '')
      .split(',')
      .filter((slot): slot is (typeof slots)[number] =>
        slots.includes(slot as (typeof slots)[number]),
      );
    if (!requestedSlots.length) return response.json({ success: true, data: {} });
    const contentType = request.query.contentType === 'VIDEO' ? 'VIDEO' : 'ARTICLE';
    const contentId = String(request.query.contentId ?? request.query.articleId ?? '');
    const side = request.query.side === 'LEFT' ? 'LEFT' : 'RIGHT';
    const candidates = await db.advertisement.findMany({
      where: { enabled: true, locations: { hasSome: requestedSlots } },
      include: { articles: { select: { articleId: true } }, videos: { select: { videoId: true } } },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    const data: Record<
      string,
      Array<{
        id: string;
        name: string;
        imageUrl: string;
        redirectUrl: string;
        sidebarPosition: string;
      }>
    > = {};
    for (const slot of [...new Set(requestedSlots)]) {
      data[slot] = candidates
        .filter((ad) => {
          if (!ad.locations.includes(slot)) return false;
          if (slot === 'ARTICLE_SIDEBAR' || slot === 'VIDEO_SIDEBAR') {
            if (ad.sidebarPosition !== 'BOTH' && ad.sidebarPosition !== side) return false;
          }
          if (slot.startsWith('ARTICLE_') && contentId && contentType === 'ARTICLE')
            return (
              ad.articleTargetMode === 'ALL' ||
              ad.articles.some((target) => target.articleId === contentId)
            );
          if (slot.startsWith('VIDEO_') && contentId && contentType === 'VIDEO')
            return (
              ad.videoTargetMode === 'ALL' ||
              ad.videos.some((target) => target.videoId === contentId)
            );
          return true;
        })
        .map(({ id, name, imageUrl, redirectUrl, sidebarPosition }) => ({
          id,
          name,
          imageUrl,
          redirectUrl,
          sidebarPosition,
        }));
    }
    response.json({ success: true, data });
  }),
);

export default router;
