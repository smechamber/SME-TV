import { Router } from 'express';
import { z } from 'zod';
import { db } from '@sme-tv/db';
import { asyncRoute, authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();
const eventRateLimit = new Map<string, { count: number; resetAt: number }>();
const slots = [
  'HOMEPAGE_TOP',
  'HOMEPAGE_MIDDLE',
  'ARTICLE_TOP',
  'ARTICLE_MIDDLE',
  'ARTICLE_BOTTOM',
  'SIDEBAR',
  'FOOTER',
  'NEWS_LIST_TOP',
  'VIDEO_LIST_TOP',
] as const;
const slotSchema = z.enum(slots);
const campaignSchema = z.object({
  advertiserId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']).default('DRAFT'),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});
const advertiserSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().max(120).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  notes: z.string().max(4000).optional().or(z.literal('')),
});
const creativeSchema = z.object({
  name: z.string().trim().min(2).max(120),
  mediaType: z.enum(['IMAGE', 'VIDEO']),
  desktopUrl: z.string().url().optional().or(z.literal('')),
  tabletUrl: z.string().url().optional().or(z.literal('')),
  mobileUrl: z.string().url().optional().or(z.literal('')),
  clickUrl: z.string().trim().min(1).max(2048).refine((value) =>
    value.startsWith('/') ? !value.startsWith('//') : /^https?:\/\//i.test(value),
  ),
  altText: z.string().trim().max(180).optional().or(z.literal('')),
});
const placementSchema = z.object({
  campaignId: z.string().min(1),
  creativeId: z.string().min(1),
  slot: slotSchema,
  targetArticleIds: z.array(z.string()).max(500).default([]),
  targetCategoryIds: z.array(z.string()).max(100).default([]),
  targetTags: z.array(z.string().trim().min(1).max(60)).max(100).default([]),
  excludedArticleIds: z.array(z.string()).max(500).default([]),
  defaultForOtherArticles: z.boolean().default(false),
  enabled: z.boolean().default(true),
  priority: z.number().int().min(0).max(1000).default(0),
});

router.get(
  '/admin/advertisers',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    const data = await db.advertiser.findMany({
      include: { _count: { select: { campaigns: true } } },
      orderBy: { companyName: 'asc' },
    });
    response.json({ success: true, data });
  }),
);

router.post(
  '/admin/advertisers',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = advertiserSchema.parse(request.body);
    const data = await db.advertiser.create({
      data: {
        ...input,
        contactName: input.contactName || null,
        email: input.email || null,
        phone: input.phone || null,
        website: input.website || null,
        notes: input.notes || null,
      },
    });
    response.status(201).json({ success: true, data });
  }),
);

router.patch(
  '/admin/advertisers/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = advertiserSchema.parse(request.body);
    const data = await db.advertiser.update({
      where: { id: String(request.params.id) },
      data: {
        ...input,
        contactName: input.contactName || null,
        email: input.email || null,
        phone: input.phone || null,
        website: input.website || null,
        notes: input.notes || null,
      },
    });
    response.json({ success: true, data });
  }),
);

router.delete(
  '/admin/advertisers/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const id = String(request.params.id);
    const campaigns = await db.adCampaign.count({ where: { advertiserId: id } });
    if (campaigns)
      return response.status(409).json({
        success: false,
        message: 'Delete this company’s campaigns before deleting the company.',
      });
    await db.advertiser.delete({ where: { id } });
    response.status(204).send();
  }),
);

router.get(
  '/admin/ad-campaigns',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    await db.adCampaign.updateMany({
      where: { status: 'ACTIVE', endsAt: { lt: new Date() } },
      data: { status: 'COMPLETED' },
    });
    const data = await db.adCampaign.findMany({
      include: {
        advertiser: true,
        creatives: true,
        placements: { include: { creative: true } },
        _count: { select: { events: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    response.json({ success: true, data });
  }),
);

router.post(
  '/admin/ad-campaigns',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = campaignSchema.parse(request.body);
    if (new Date(input.endsAt) <= new Date(input.startsAt))
      return response.status(400).json({ success: false, message: 'End date must be after start date.' });
    const data = await db.adCampaign.create({
      data: { ...input, startsAt: new Date(input.startsAt), endsAt: new Date(input.endsAt) },
      include: { advertiser: true },
    });
    response.status(201).json({ success: true, data });
  }),
);

router.patch(
  '/admin/ad-campaigns/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = campaignSchema.parse(request.body);
    if (new Date(input.endsAt) <= new Date(input.startsAt))
      return response.status(400).json({ success: false, message: 'End date must be after start date.' });
    const data = await db.adCampaign.update({
      where: { id: String(request.params.id) },
      data: { ...input, startsAt: new Date(input.startsAt), endsAt: new Date(input.endsAt) },
      include: { advertiser: true },
    });
    response.json({ success: true, data });
  }),
);

router.delete(
  '/admin/ad-campaigns/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    await db.adCampaign.delete({ where: { id: String(request.params.id) } });
    response.status(204).send();
  }),
);

router.post(
  '/admin/ad-campaigns/:id/creatives',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = creativeSchema.parse(request.body);
    if (![input.desktopUrl, input.tabletUrl, input.mobileUrl].some(Boolean))
      return response.status(400).json({ success: false, message: 'Upload at least one creative size.' });
    const data = await db.adCreative.create({
      data: {
        ...input,
        campaignId: String(request.params.id),
        desktopUrl: input.desktopUrl || null,
        tabletUrl: input.tabletUrl || null,
        mobileUrl: input.mobileUrl || null,
        altText: input.altText || null,
      },
    });
    response.status(201).json({ success: true, data });
  }),
);

router.patch(
  '/admin/ad-creatives/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = creativeSchema.parse(request.body);
    if (![input.desktopUrl, input.tabletUrl, input.mobileUrl].some(Boolean))
      return response.status(400).json({ success: false, message: 'Upload at least one creative size.' });
    const data = await db.adCreative.update({
      where: { id: String(request.params.id) },
      data: {
        ...input,
        desktopUrl: input.desktopUrl || null,
        tabletUrl: input.tabletUrl || null,
        mobileUrl: input.mobileUrl || null,
        altText: input.altText || null,
      },
    });
    response.json({ success: true, data });
  }),
);

router.delete(
  '/admin/ad-creatives/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    await db.adCreative.delete({ where: { id: String(request.params.id) } });
    response.status(204).send();
  }),
);

router.get(
  '/admin/ad-targets',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    const [articles, categories] = await Promise.all([
      db.article.findMany({
        orderBy: { title: 'asc' },
        take: 500,
        select: { id: true, title: true, slug: true, tags: true, categoryId: true },
      }),
      db.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    ]);
    response.json({ success: true, data: { articles, categories } });
  }),
);

router.get(
  '/admin/ad-placements',
  authenticate,
  requireAdmin,
  asyncRoute(async (_request, response) => {
    const data = await db.adPlacement.findMany({
      include: { campaign: { include: { advertiser: true } }, creative: true },
      orderBy: [{ slot: 'asc' }, { priority: 'desc' }],
    });
    response.json({ success: true, data, slots });
  }),
);

router.post(
  '/admin/ad-placements',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = placementSchema.parse(request.body);
    const campaign = await db.adCampaign.findUnique({ where: { id: input.campaignId } });
    const creative = await db.adCreative.findUnique({ where: { id: input.creativeId } });
    if (!campaign || !creative || creative.campaignId !== campaign.id)
      return response.status(400).json({ success: false, message: 'Choose a creative from this campaign.' });
    const data = await db.adPlacement.create({
      data: input,
      include: { campaign: { include: { advertiser: true } }, creative: true },
    });
    response.status(201).json({ success: true, data });
  }),
);

router.patch(
  '/admin/ad-placements/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const input = placementSchema.parse(request.body);
    const creative = await db.adCreative.findUnique({ where: { id: input.creativeId } });
    if (!creative || creative.campaignId !== input.campaignId)
      return response.status(400).json({ success: false, message: 'Choose a creative from this campaign.' });
    const data = await db.adPlacement.update({
      where: { id: String(request.params.id) },
      data: input,
      include: { campaign: { include: { advertiser: true } }, creative: true },
    });
    response.json({ success: true, data });
  }),
);

router.delete(
  '/admin/ad-placements/:id',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    await db.adPlacement.delete({ where: { id: String(request.params.id) } });
    response.status(204).send();
  }),
);

router.get(
  '/admin/ad-reports',
  authenticate,
  requireAdmin,
  asyncRoute(async (request, response) => {
    const from = request.query.from ? new Date(String(request.query.from)) : new Date(Date.now() - 30 * 86400000);
    const to = request.query.to ? new Date(String(request.query.to)) : new Date();
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to)
      return response.status(400).json({ success: false, message: 'Choose a valid report date range.' });
    const where = { createdAt: { gte: from, lte: to } };
    const [totals, byCampaign, byAdvertiser, bySlot] = await Promise.all([
      db.adEvent.groupBy({ by: ['eventType'], where, _count: { _all: true } }),
      db.adEvent.groupBy({ by: ['campaignId', 'eventType'], where, _count: { _all: true } }),
      db.adEvent.groupBy({ by: ['advertiserId', 'eventType'], where, _count: { _all: true } }),
      db.adEvent.groupBy({ by: ['slot', 'eventType'], where, _count: { _all: true } }),
    ]);
    const ids = {
      campaigns: [...new Set(byCampaign.map((row) => row.campaignId))],
      advertisers: [...new Set(byAdvertiser.map((row) => row.advertiserId))],
    };
    const [campaigns, advertisers] = await Promise.all([
      db.adCampaign.findMany({ where: { id: { in: ids.campaigns } }, select: { id: true, name: true } }),
      db.advertiser.findMany({ where: { id: { in: ids.advertisers } }, select: { id: true, companyName: true } }),
    ]);
    response.json({
      success: true,
      data: {
        from,
        to,
        totals: Object.fromEntries(totals.map((item) => [item.eventType, item._count._all])),
        byCampaign: byCampaign.map((item) => ({ ...item, name: campaigns.find((row) => row.id === item.campaignId)?.name ?? 'Deleted campaign' })),
        byAdvertiser: byAdvertiser.map((item) => ({ ...item, name: advertisers.find((row) => row.id === item.advertiserId)?.companyName ?? 'Deleted company' })),
        bySlot,
      },
    });
  }),
);

router.get(
  '/ads',
  asyncRoute(async (request, response) => {
    const requestedSlots = String(request.query.slots ?? request.query.slot ?? '')
      .split(',')
      .filter((slot): slot is (typeof slots)[number] => slots.includes(slot as (typeof slots)[number]));
    if (!requestedSlots.length) return response.json({ success: true, data: {} });
    const articleId = String(request.query.articleId ?? '');
    const categoryId = String(request.query.categoryId ?? '');
    const tags = String(request.query.tags ?? '').split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    const device = ['MOBILE', 'TABLET', 'DESKTOP'].includes(String(request.query.device).toUpperCase())
      ? String(request.query.device).toUpperCase()
      : 'DESKTOP';
    const now = new Date();
    const candidates = await db.adPlacement.findMany({
      where: {
        enabled: true,
        slot: { in: requestedSlots },
        campaign: { status: 'ACTIVE', startsAt: { lte: now }, endsAt: { gte: now } },
      },
      include: { campaign: { include: { advertiser: true } }, creative: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });
    const selected: Record<string, unknown> = {};
    const usedCreativeIds = new Set<string>();
    for (const slot of requestedSlots) {
      const eligible = candidates.flatMap((placement) => {
        if (placement.slot !== slot || usedCreativeIds.has(placement.creativeId)) return [];
        if (articleId && placement.excludedArticleIds.includes(articleId)) return [];
        const hasRules = placement.targetArticleIds.length + placement.targetCategoryIds.length + placement.targetTags.length > 0;
        const articleMatch = Boolean(articleId && placement.targetArticleIds.includes(articleId));
        const categoryMatch = Boolean(categoryId && placement.targetCategoryIds.includes(categoryId));
        const tagMatch = tags.some((tag) => placement.targetTags.some((target) => target.toLowerCase() === tag));
        const targetedMatch = articleMatch || categoryMatch || tagMatch;
        if (hasRules && !targetedMatch && !(articleId && placement.defaultForOtherArticles)) return [];
        const specificity = articleMatch ? 4 : categoryMatch ? 3 : tagMatch ? 2 : hasRules ? 1 : 0;
        const url = device === 'MOBILE'
          ? placement.creative.mobileUrl ?? placement.creative.tabletUrl ?? placement.creative.desktopUrl
          : device === 'TABLET'
            ? placement.creative.tabletUrl ?? placement.creative.desktopUrl ?? placement.creative.mobileUrl
            : placement.creative.desktopUrl ?? placement.creative.tabletUrl ?? placement.creative.mobileUrl;
        if (!url) return [];
        return [{ placement, url, specificity }];
      });
      if (!eligible.length) continue;
      const bestSpecificity = Math.max(...eligible.map((item) => item.specificity));
      const bestPriority = Math.max(...eligible.filter((item) => item.specificity === bestSpecificity).map((item) => item.placement.priority));
      const pool = eligible.filter((item) => item.specificity === bestSpecificity && item.placement.priority === bestPriority);
      const seed = Date.now() + [...`${articleId}:${slot}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const chosen = pool[seed % pool.length]!;
      usedCreativeIds.add(chosen.placement.creativeId);
      selected[slot] = {
        placementId: chosen.placement.id,
        campaignId: chosen.placement.campaignId,
        creativeId: chosen.placement.creativeId,
        advertiserId: chosen.placement.campaign.advertiserId,
        companyName: chosen.placement.campaign.advertiser.companyName,
        mediaType: chosen.placement.creative.mediaType,
        url: chosen.url,
        clickUrl: chosen.placement.creative.clickUrl,
        altText: chosen.placement.creative.altText ?? chosen.placement.creative.name,
        slot,
      };
    }
    response.json({ success: true, data: selected });
  }),
);

router.post(
  '/ads/events',
  asyncRoute(async (request, response) => {
    const nowMs = Date.now();
    const rateKey = request.ip ?? 'unknown';
    if (eventRateLimit.size > 10_000) {
      for (const [key, window] of eventRateLimit) {
        if (window.resetAt <= nowMs) eventRateLimit.delete(key);
      }
    }
    const rateWindow = eventRateLimit.get(rateKey);
    if (!rateWindow || rateWindow.resetAt <= nowMs) {
      eventRateLimit.set(rateKey, { count: 1, resetAt: nowMs + 60_000 });
    } else if (rateWindow.count >= 120) {
      return response.status(429).json({ success: false, message: 'Ad tracking limit reached.' });
    } else {
      rateWindow.count++;
    }
    const input = z.object({
      placementId: z.string().min(1),
      eventType: z.enum(['IMPRESSION', 'CLICK']),
      articleId: z.string().optional(),
      device: z.enum(['DESKTOP', 'TABLET', 'MOBILE']).default('DESKTOP'),
    }).parse(request.body);
    const placement = await db.adPlacement.findFirst({
      where: {
        id: input.placementId,
        enabled: true,
        campaign: { status: 'ACTIVE', startsAt: { lte: new Date() }, endsAt: { gte: new Date() } },
      },
      include: { campaign: true },
    });
    if (!placement) return response.status(404).json({ success: false, message: 'Ad is no longer active.' });
    await db.adEvent.create({
      data: {
        advertiserId: placement.campaign.advertiserId,
        campaignId: placement.campaignId,
        creativeId: placement.creativeId,
        placementId: placement.id,
        eventType: input.eventType,
        slot: placement.slot,
        articleId: input.articleId || null,
        device: input.device,
      },
    });
    response.status(204).send();
  }),
);

export default router;
