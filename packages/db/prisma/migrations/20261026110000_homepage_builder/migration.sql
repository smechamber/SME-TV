-- CreateEnum
CREATE TYPE "HomepageSectionKind" AS ENUM ('HERO', 'TRENDING', 'LATEST', 'INTERVIEWS', 'NEWS', 'VIDEOS', 'EVENTS', 'CUSTOM');
CREATE TYPE "HomepageLayout" AS ENUM ('HERO', 'GRID', 'LIST', 'CAROUSEL');
CREATE TYPE "HomepageDesign" AS ENUM ('STANDARD', 'FEATURED_GRID', 'SPLIT_FEATURED', 'DARK_BAND', 'COMPACT_LIST', 'EVENT_CARDS');
CREATE TYPE "HomepageSource" AS ENUM ('MANUAL', 'LATEST', 'TRENDING');
CREATE TYPE "HomepageContentType" AS ENUM ('ARTICLE', 'VIDEO', 'EVENT');

-- CreateTable
CREATE TABLE "HomepageSection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "HomepageSectionKind" NOT NULL DEFAULT 'CUSTOM',
    "layout" "HomepageLayout" NOT NULL DEFAULT 'GRID',
    "design" "HomepageDesign" NOT NULL DEFAULT 'STANDARD',
    "source" "HomepageSource" NOT NULL DEFAULT 'MANUAL',
    "contentType" "HomepageContentType" NOT NULL DEFAULT 'ARTICLE',
    "itemCount" INTEGER NOT NULL DEFAULT 6,
    "contentIds" TEXT[] NOT NULL,
    "displayFields" TEXT[] NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HomepageSection_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HomepageSection_enabled_displayOrder_idx" ON "HomepageSection"("enabled", "displayOrder");
