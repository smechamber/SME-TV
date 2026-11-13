import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { db } from '@sme-tv/db';
import { asyncRoute, authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();
const NEWS_PAGE_CONFIG_NAME = '__NEWS_PAGE_BUILDER_CONFIG__';
const NEWS_PAGE_AD_PREFIX = '__NEWS_PAGE_AD__:';
const newsPageConfigSchema = z.object({
  imageUrl: z.union([z.string().url(), z.literal('')]),
  placement: z.enum(['ARTICLE_LIST', 'BELOW_SEARCH', 'BELOW_EVENTS']),
});
const newsPageAdSchema = z.object({
  name: z.string().trim().min(1).max(80),
  imageUrl: z.string().url(),
  clickUrl: z
    .string()
    .trim()
    .min(1)
    .max(2048)
    .refine((value) =>
      value.startsWith('/') ? !value.startsWith('//') : /^https?:\/\//i.test(value),
    ),
  placement: z.enum(['ARTICLE_LIST', 'BELOW_SEARCH', 'BELOW_EVENTS']),
  articlePosition: z.number().int().min(1).max(100).default(1),
});

function placementFromOrder(order: number) {
  const placements = ['ARTICLE_LIST', 'BELOW_SEARCH', 'BELOW_EVENTS'] as const;
  return placements[order] ?? 'ARTICLE_LIST';
}

function presentNewsPageConfig(
  section: {
    contentIds: string[];
    displayOrder: number;
    enabled: boolean;
  } | null,
) {
  return {
    imageUrl: section?.enabled ? (section.contentIds[0] ?? '') : '',
    placement: placementFromOrder(section?.displayOrder ?? 0),
  };
}

async function getNewsPageAds() {
  const [sections, legacy] = await Promise.all([
    db.homepageSection.findMany({
      where: { name: { startsWith: NEWS_PAGE_AD_PREFIX }, enabled: true },
      orderBy: { createdAt: 'asc' },
    }),
    db.homepageSection.findFirst({ where: { name: NEWS_PAGE_CONFIG_NAME, enabled: true } }),
  ]);
  const ads = sections
    .filter((section) => Boolean(section.contentIds[0]))
    .map((section) => ({
      id: section.id,
      name: section.displayFields[0] ?? 'Untitled ad',
      imageUrl: section.contentIds[0]!,
      clickUrl: section.contentIds[1] ?? '/news',
      placement: placementFromOrder(section.displayOrder),
      articlePosition: Number(section.contentIds[2]) || 1,
    }));
  if (legacy?.contentIds[0]) {
    ads.unshift({
      id: legacy.id,
      name: 'News page image',
      imageUrl: legacy.contentIds[0]!,
      clickUrl: '/news',
      placement: placementFromOrder(legacy.displayOrder),
      articlePosition: 1,
    });
  }
  return ads;
}

const sectionSchema = z.object({
  name: z.string().trim().min(1).max(80),
  kind: z.enum(['HERO', 'TRENDING', 'LATEST', 'INTERVIEWS', 'NEWS', 'VIDEOS', 'EVENTS', 'CUSTOM']),
  layout: z.enum(['HERO', 'GRID', 'LIST', 'CAROUSEL']),
  design: z.enum([
    'STANDARD',
    'FEATURED_GRID',
    'SPLIT_FEATURED',
    'DARK_BAND',
    'COMPACT_LIST',
    'EVENT_CARDS',
  ]),
  source: z.enum(['MANUAL', 'LATEST', 'TRENDING']),
  contentType: z.enum(['ARTICLE', 'VIDEO', 'EVENT', 'MIXED']),
  itemCount: z.number().int().min(1).max(302),
  contentIds: z.array(z.string()).max(302),
  displayFields: z.array(z.enum(['IMAGE', 'CATEGORY', 'SUMMARY', 'DATE', 'META'])).max(5),
  displayOrder: z.number().int().min(0),
  enabled: z.boolean(),
});

const publishedWhere = () => ({ status: 'PUBLISHED' as const, publishedAt: { lte: new Date() } });
const present = <T>(item: T | undefined): item is T => Boolean(item);

function keepSingleTrendingSection<T extends {
  id: string;
  kind: string;
  enabled: boolean;
  contentIds: string[];
  displayOrder: number;
  createdAt: Date;
}>(sections: T[]): T[] {
  const trending = sections
    .filter((section) => section.kind === 'TRENDING')
    .sort(
      (a, b) =>
        Number(b.enabled) - Number(a.enabled) ||
        b.contentIds.length - a.contentIds.length ||
        a.displayOrder - b.displayOrder ||
        a.createdAt.getTime() - b.createdAt.getTime(),
    );
  const retainedId = trending[0]?.id;
  return sections.filter((section) => section.kind !== 'TRENDING' || section.id === retainedId);
}

async function removeDuplicateTrendingSections<T extends {
  id: string;
  kind: string;
  enabled: boolean;
  contentIds: string[];
  displayOrder: number;
  createdAt: Date;
}>(sections: T[]): Promise<T[]> {
  const retainedSections = keepSingleTrendingSection(sections);
  const retainedIds = new Set(retainedSections.map((section) => section.id));
  const duplicateIds = sections
    .filter((section) => section.kind === 'TRENDING' && !retainedIds.has(section.id))
    .map((section) => section.id);

  if (duplicateIds.length) {
    await db.homepageSection.deleteMany({ where: { id: { in: duplicateIds } } });
  }

  return retainedSections;
}

async function getContent(
  contentType: 'ARTICLE' | 'VIDEO' | 'EVENT' | 'MIXED',
  source: 'MANUAL' | 'LATEST' | 'TRENDING',
  ids: string[],
  itemCount: number,
): Promise<Array<{ id: string }>> {
  if (contentType === 'MIXED') {
    const [articles, videos, events] = await Promise.all([
      getContent('ARTICLE', source, ids, itemCount),
      getContent('VIDEO', source, ids, itemCount),
      getContent('EVENT', source, ids, itemCount),
    ]);
    const all = [...articles, ...videos, ...events];
    return source === 'MANUAL'
      ? ids.map((id) => all.find((item) => item.id === id)).filter(present)
      : all.slice(0, itemCount);
  }
  if (contentType === 'ARTICLE') {
    const where = source === 'MANUAL' ? { ...publishedWhere(), id: { in: ids } } : publishedWhere();
    const data = await db.article.findMany({
      where,
      take: itemCount,
      orderBy:
        source === 'TRENDING'
          ? [{ isFeatured: 'desc' }, { publishedAt: 'desc' }]
          : { publishedAt: 'desc' },
      include: { category: { select: { name: true } } },
    });
    return source === 'MANUAL'
      ? ids.map((id) => data.find((item) => item.id === id)).filter(present)
      : data;
  }
  if (contentType === 'VIDEO') {
    const where = source === 'MANUAL' ? { ...publishedWhere(), id: { in: ids } } : publishedWhere();
    const data = await db.video.findMany({
      where,
      take: itemCount,
      orderBy:
        source === 'TRENDING'
          ? [{ isFeatured: 'desc' }, { publishedAt: 'desc' }]
          : { publishedAt: 'desc' },
    });
    return source === 'MANUAL'
      ? ids.map((id) => data.find((item) => item.id === id)).filter(present)
      : data;
  }
  const where =
    source === 'MANUAL'
      ? { status: 'PUBLISHED' as const, startsAt: { gte: new Date() }, id: { in: ids }, clickUrl: { not: null } }
      : { status: 'PUBLISHED' as const, startsAt: { gte: new Date() }, clickUrl: { not: null } };
  const data = await db.event.findMany({ where, take: itemCount, orderBy: { startsAt: 'asc' } });
  return source === 'MANUAL'
    ? ids.map((id) => data.find((item) => item.id === id)).filter(present)
    : data;
}

async function resolveSection(section: {
  id: string;
  kind: string;
  contentType: 'ARTICLE' | 'VIDEO' | 'EVENT' | 'MIXED';
  source: 'MANUAL' | 'LATEST' | 'TRENDING';
  contentIds: string[];
  itemCount: number;
}) {
  const markerIndex = section.contentIds.indexOf('__HERO_LATEST__');
  const heroVideoId =
    section.kind === 'HERO'
      ? markerIndex >= 0
        ? (section.contentIds.slice(0, markerIndex)[0] ?? null)
        : (section.contentIds[0] ?? null)
      : undefined;
  return {
    ...section,
    ...(section.kind === 'HERO' ? { heroVideoId } : {}),
    items: await getContent(
      section.contentType,
      section.source,
      section.contentIds,
      section.itemCount,
    ),
  };
}

router.get(
  '/homepage',
  asyncRoute(async (_request, response) => {
    const sections = keepSingleTrendingSection(await db.homepageSection.findMany({
      where: {
        enabled: true,
        NOT: [{ name: NEWS_PAGE_CONFIG_NAME }, { name: { startsWith: NEWS_PAGE_AD_PREFIX } }],
      },
      orderBy: { displayOrder: 'asc' },
    }));
    sections.sort((a, b) => {
      if (a.kind === 'HERO') return -1;
      if (b.kind === 'HERO') return 1;
      return a.displayOrder - b.displayOrder;
    });
    response.json({ success: true, data: await Promise.all(sections.map(resolveSection)) });
  }),
);

router.get(
  '/admin/homepage',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    const sections = await removeDuplicateTrendingSections(await db.homepageSection.findMany({
      where: {
        NOT: [{ name: NEWS_PAGE_CONFIG_NAME }, { name: { startsWith: NEWS_PAGE_AD_PREFIX } }],
      },
      orderBy: { displayOrder: 'asc' },
    }));
    response.json({ success: true, data: sections });
  }),
);

router.get(
  '/news-page',
  asyncRoute(async (_request, response) => {
    response.json({ success: true, data: await getNewsPageAds() });
  }),
);

router.get(
  '/admin/news-page/ads',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    response.json({ success: true, data: await getNewsPageAds() });
  }),
);

router.post(
  '/admin/news-page/ads',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = newsPageAdSchema.parse(request.body);
    const placement = ['ARTICLE_LIST', 'BELOW_SEARCH', 'BELOW_EVENTS'].indexOf(input.placement);
    const data = await db.homepageSection.create({
      data: {
        name: `${NEWS_PAGE_AD_PREFIX}${randomUUID()}`,
        kind: 'NEWS',
        layout: 'LIST',
        design: 'STANDARD',
        source: 'MANUAL',
        contentType: 'ARTICLE',
        itemCount: 1,
        contentIds: [input.imageUrl, input.clickUrl, String(input.articlePosition)],
        displayFields: [input.name],
        displayOrder: placement,
        enabled: true,
      },
    });
    response.status(201).json({
      success: true,
      data: {
        id: data.id,
        name: input.name,
        imageUrl: input.imageUrl,
        clickUrl: input.clickUrl,
        placement: input.placement,
        articlePosition: input.articlePosition,
      },
    });
  }),
);

router.put(
  '/admin/news-page/ads/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = newsPageAdSchema.parse(request.body);
    const id = String(request.params.id);
    const section = await db.homepageSection.findUnique({ where: { id } });
    if (!section || !section.name.startsWith(NEWS_PAGE_AD_PREFIX)) {
      return response.status(404).json({ success: false, message: 'Ad not found' });
    }
    const placement = ['ARTICLE_LIST', 'BELOW_SEARCH', 'BELOW_EVENTS'].indexOf(input.placement);
    const data = await db.homepageSection.update({
      where: { id },
      data: {
        contentIds: [input.imageUrl, input.clickUrl, String(input.articlePosition)],
        displayFields: [input.name],
        displayOrder: placement,
      },
    });
    response.json({
      success: true,
      data: {
        id: data.id,
        name: input.name,
        imageUrl: input.imageUrl,
        clickUrl: input.clickUrl,
        placement: input.placement,
        articlePosition: input.articlePosition,
      },
    });
  }),
);

router.delete(
  '/admin/news-page/ads/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const id = String(request.params.id);
    const section = await db.homepageSection.findUnique({ where: { id } });
    if (
      !section ||
      (!section.name.startsWith(NEWS_PAGE_AD_PREFIX) && section.name !== NEWS_PAGE_CONFIG_NAME)
    ) {
      return response.status(404).json({ success: false, message: 'Ad not found' });
    }
    await db.homepageSection.delete({ where: { id } });
    response.status(204).send();
  }),
);

router.get(
  '/admin/news-page',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    const section = await db.homepageSection.findFirst({ where: { name: NEWS_PAGE_CONFIG_NAME } });
    response.json({ success: true, data: presentNewsPageConfig(section) });
  }),
);

router.put(
  '/admin/news-page',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = newsPageConfigSchema.parse(request.body);
    const existing = await db.homepageSection.findFirst({ where: { name: NEWS_PAGE_CONFIG_NAME } });
    const placement = ['ARTICLE_LIST', 'BELOW_SEARCH', 'BELOW_EVENTS'].indexOf(input.placement);
    const data = {
      name: NEWS_PAGE_CONFIG_NAME,
      kind: 'NEWS' as const,
      layout: 'LIST' as const,
      design: 'STANDARD' as const,
      source: 'MANUAL' as const,
      contentType: 'ARTICLE' as const,
      itemCount: 1,
      contentIds: input.imageUrl ? [input.imageUrl] : [],
      displayFields: ['IMAGE'],
      displayOrder: placement,
      enabled: Boolean(input.imageUrl),
    };
    const saved = existing
      ? await db.homepageSection.update({ where: { id: existing.id }, data })
      : await db.homepageSection.create({ data });
    response.json({ success: true, data: presentNewsPageConfig(saved) });
  }),
);

router.get(
  '/admin/homepage/content',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    const [articles, videos, events] = await Promise.all([
      db.article.findMany({
        where: publishedWhere(),
        orderBy: { publishedAt: 'desc' },
        take: 100,
        select: {
          id: true,
          title: true,
          summary: true,
          imageUrl: true,
          publishedAt: true,
          category: { select: { name: true } },
        },
      }),
      db.video.findMany({
        where: publishedWhere(),
        orderBy: { publishedAt: 'desc' },
        take: 100,
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          videoType: true,
          videoUrl: true,
          youtubeId: true,
          publishedAt: true,
        },
      }),
      db.event.findMany({
        where: { status: 'PUBLISHED', startsAt: { gte: new Date() }, clickUrl: { not: null } },
        orderBy: { startsAt: 'asc' },
        take: 100,
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          eventType: true,
          clickUrl: true,
          startsAt: true,
          location: true,
        },
      }),
    ]);
    response.json({ success: true, data: { ARTICLE: articles, VIDEO: videos, EVENT: events } });
  }),
);

router.post(
  '/admin/homepage',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = sectionSchema.parse(request.body);
    if (input.kind === 'EVENTS') {
      const existing = await db.homepageSection.findFirst({ where: { kind: 'EVENTS' } });
      Object.assign(input, {
        name: 'Upcoming Events',
        layout: 'GRID',
        design: 'EVENT_CARDS',
        source: 'LATEST',
        contentType: 'EVENT',
        itemCount: 3,
        contentIds: [],
      });
      if (existing) {
        const data = await db.homepageSection.update({ where: { id: existing.id }, data: input });
        return response.json({ success: true, data });
      }
    }
    if (input.kind === 'HERO' || input.kind === 'TRENDING') {
      const existing = await db.homepageSection.findFirst({ where: { kind: input.kind } });
      if (existing) {
        const data = await db.homepageSection.update({ where: { id: existing.id }, data: input });
        return response.json({ success: true, data });
      }
    }
    const data = await db.homepageSection.create({ data: input });
    response.status(201).json({ success: true, data });
  }),
);

router.put(
  '/admin/homepage/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = sectionSchema.parse(request.body);
    const id = String(request.params.id);
    const existing = await db.homepageSection.findUnique({ where: { id } });
    if (existing?.kind === 'HERO') {
      input.kind = 'HERO';
      input.layout = 'HERO';
      input.design = 'SPLIT_FEATURED';
      input.source = 'MANUAL';
      input.contentType = 'MIXED';
      input.displayOrder = 0;
      input.enabled = true;
      input.name = 'Hero + Latest';
    }
    if (existing?.kind === 'TRENDING') {
      input.kind = 'TRENDING';
      input.layout = 'GRID';
      input.design = 'STANDARD';
      input.contentType = 'MIXED';
      input.displayOrder = Math.max(1, input.displayOrder);
      input.name = 'Trending on SMETV';
    }
    if (existing?.kind === 'EVENTS') {
      input.kind = 'EVENTS';
      input.name = 'Upcoming Events';
      input.layout = 'GRID';
      input.design = 'EVENT_CARDS';
      input.source = 'LATEST';
      input.contentType = 'EVENT';
      input.itemCount = 3;
      input.contentIds = [];
    }
    const data = await db.homepageSection.update({ where: { id }, data: input });
    response.json({ success: true, data });
  }),
);

router.delete(
  '/admin/homepage/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const id = String(request.params.id);
    const section = await db.homepageSection.findUnique({ where: { id } });
    if (section?.kind === 'HERO')
      return response
        .status(409)
        .json({ success: false, message: 'The fixed hero section cannot be deleted.' });
    if (section?.kind === 'EVENTS')
      return response.status(409).json({ success: false, message: 'The Upcoming Events section can be disabled instead.' });
    await db.homepageSection.delete({ where: { id } });
    response.status(204).send();
  }),
);

export default router;
