-- Remove the campaign based advertising data. Article and Video records are not modified.
DROP TABLE "AdEvent";
DROP TABLE "AdPlacement";
DROP TABLE "AdCreative";
DROP TABLE "AdCampaign";
DROP TABLE "Advertiser";

DROP TYPE "AdEventType";
DROP TYPE "AdDevice";
DROP TYPE "AdMediaType";
DROP TYPE "CampaignStatus";
DROP TYPE "AdSlot";

CREATE TYPE "AdSlot" AS ENUM (
  'HOMEPAGE_TOP', 'HOMEPAGE_MIDDLE', 'HOMEPAGE_BOTTOM',
  'ARTICLE_TOP', 'ARTICLE_MIDDLE', 'ARTICLE_BOTTOM', 'ARTICLE_SIDEBAR',
  'VIDEO_TOP', 'VIDEO_MIDDLE', 'VIDEO_BOTTOM', 'VIDEO_SIDEBAR',
  'NEWS_LIST_TOP', 'VIDEO_LIST_TOP', 'FOOTER'
);
CREATE TYPE "ContentTargetMode" AS ENUM ('ALL', 'SELECTED');
CREATE TYPE "AdSidebarPosition" AS ENUM ('LEFT', 'RIGHT', 'BOTH');

CREATE TABLE "Advertisement" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "redirectUrl" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "locations" "AdSlot"[] NOT NULL DEFAULT ARRAY[]::"AdSlot"[],
  "articleTargetMode" "ContentTargetMode" NOT NULL DEFAULT 'ALL',
  "videoTargetMode" "ContentTargetMode" NOT NULL DEFAULT 'ALL',
  "sidebarPosition" "AdSidebarPosition" NOT NULL DEFAULT 'BOTH',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Advertisement_enabled_createdAt_idx" ON "Advertisement"("enabled", "createdAt");

CREATE TABLE "AdvertisementArticle" (
  "advertisementId" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  CONSTRAINT "AdvertisementArticle_pkey" PRIMARY KEY ("advertisementId", "articleId")
);
CREATE INDEX "AdvertisementArticle_articleId_idx" ON "AdvertisementArticle"("articleId");
ALTER TABLE "AdvertisementArticle" ADD CONSTRAINT "AdvertisementArticle_advertisementId_fkey"
  FOREIGN KEY ("advertisementId") REFERENCES "Advertisement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdvertisementArticle" ADD CONSTRAINT "AdvertisementArticle_articleId_fkey"
  FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AdvertisementVideo" (
  "advertisementId" TEXT NOT NULL,
  "videoId" TEXT NOT NULL,
  CONSTRAINT "AdvertisementVideo_pkey" PRIMARY KEY ("advertisementId", "videoId")
);
CREATE INDEX "AdvertisementVideo_videoId_idx" ON "AdvertisementVideo"("videoId");
ALTER TABLE "AdvertisementVideo" ADD CONSTRAINT "AdvertisementVideo_advertisementId_fkey"
  FOREIGN KEY ("advertisementId") REFERENCES "Advertisement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdvertisementVideo" ADD CONSTRAINT "AdvertisementVideo_videoId_fkey"
  FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
