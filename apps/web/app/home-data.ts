export type Story = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  category?: { name?: string };
  publishedAt?: string;
  readTime?: string;
};

export type Video = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  views?: string;
  videoType?: 'UPLOAD' | 'YOUTUBE';
  videoUrl?: string;
  youtubeId?: string;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  startsAt: string;
  tag?: string;
};

export type HomepageItem = Story | Video | EventItem;
export type HomepageSection = {
  id: string;
  name: string;
  kind: string;
  layout: 'HERO' | 'GRID' | 'LIST' | 'CAROUSEL';
  design:
    'STANDARD' | 'FEATURED_GRID' | 'SPLIT_FEATURED' | 'DARK_BAND' | 'COMPACT_LIST' | 'EVENT_CARDS';
  source: 'MANUAL' | 'LATEST' | 'TRENDING';
  contentType: 'ARTICLE' | 'VIDEO' | 'EVENT' | 'MIXED';
  itemCount: number;
  displayFields: ('IMAGE' | 'CATEGORY' | 'SUMMARY' | 'DATE' | 'META')[];
  items: HomepageItem[];
  heroVideoId?: string | null;
};