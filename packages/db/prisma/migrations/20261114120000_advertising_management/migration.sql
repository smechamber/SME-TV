CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED');
CREATE TYPE "AdMediaType" AS ENUM ('IMAGE', 'VIDEO');
CREATE TYPE "AdSlot" AS ENUM ('HOMEPAGE_TOP', 'HOMEPAGE_MIDDLE', 'ARTICLE_TOP', 'ARTICLE_MIDDLE', 'ARTICLE_BOTTOM', 'SIDEBAR', 'FOOTER', 'NEWS_LIST_TOP', 'VIDEO_LIST_TOP');
CREATE TYPE "AdEventType" AS ENUM ('IMPRESSION', 'CLICK');
CREATE TYPE "AdDevice" AS ENUM ('DESKTOP', 'TABLET', 'MOBILE');

ALTER TABLE "Article" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "Advertiser" (
  "id" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "contactName" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "website" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Advertiser_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Advertiser_companyName_idx" ON "Advertiser"("companyName");

CREATE TABLE "AdCampaign" (
  "id" TEXT NOT NULL,
  "advertiserId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdCampaign_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdCampaign_status_startsAt_endsAt_idx" ON "AdCampaign"("status", "startsAt", "endsAt");
CREATE INDEX "AdCampaign_advertiserId_createdAt_idx" ON "AdCampaign"("advertiserId", "createdAt");
ALTER TABLE "AdCampaign" ADD CONSTRAINT "AdCampaign_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "Advertiser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "AdCreative" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "mediaType" "AdMediaType" NOT NULL,
  "desktopUrl" TEXT,
  "tabletUrl" TEXT,
  "mobileUrl" TEXT,
  "clickUrl" TEXT NOT NULL,
  "altText" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdCreative_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdCreative_campaignId_createdAt_idx" ON "AdCreative"("campaignId", "createdAt");
ALTER TABLE "AdCreative" ADD CONSTRAINT "AdCreative_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AdCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AdPlacement" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "creativeId" TEXT NOT NULL,
  "slot" "AdSlot" NOT NULL,
  "targetArticleIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "targetCategoryIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "targetTags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "excludedArticleIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "defaultForOtherArticles" BOOLEAN NOT NULL DEFAULT false,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdPlacement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdPlacement_slot_enabled_priority_idx" ON "AdPlacement"("slot", "enabled", "priority");
CREATE INDEX "AdPlacement_campaignId_slot_idx" ON "AdPlacement"("campaignId", "slot");
ALTER TABLE "AdPlacement" ADD CONSTRAINT "AdPlacement_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AdCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdPlacement" ADD CONSTRAINT "AdPlacement_creativeId_fkey" FOREIGN KEY ("creativeId") REFERENCES "AdCreative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AdEvent" (
  "id" TEXT NOT NULL,
  "advertiserId" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "creativeId" TEXT NOT NULL,
  "placementId" TEXT NOT NULL,
  "eventType" "AdEventType" NOT NULL,
  "slot" "AdSlot" NOT NULL,
  "articleId" TEXT,
  "device" "AdDevice" NOT NULL DEFAULT 'DESKTOP',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdEvent_eventType_createdAt_idx" ON "AdEvent"("eventType", "createdAt");
CREATE INDEX "AdEvent_campaignId_createdAt_idx" ON "AdEvent"("campaignId", "createdAt");
CREATE INDEX "AdEvent_advertiserId_createdAt_idx" ON "AdEvent"("advertiserId", "createdAt");
CREATE INDEX "AdEvent_slot_createdAt_idx" ON "AdEvent"("slot", "createdAt");
ALTER TABLE "AdEvent" ADD CONSTRAINT "AdEvent_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "Advertiser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdEvent" ADD CONSTRAINT "AdEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AdCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdEvent" ADD CONSTRAINT "AdEvent_creativeId_fkey" FOREIGN KEY ("creativeId") REFERENCES "AdCreative"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdEvent" ADD CONSTRAINT "AdEvent_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "AdPlacement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
