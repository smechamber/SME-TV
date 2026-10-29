export type ContentType = 'ARTICLE' | 'VIDEO' | 'EVENT' | 'MIXED';

export type Field = 'IMAGE' | 'CATEGORY' | 'SUMMARY' | 'DATE' | 'META';

export type Design =
  'STANDARD' | 'FEATURED_GRID' | 'SPLIT_FEATURED' | 'DARK_BAND' | 'COMPACT_LIST' | 'EVENT_CARDS';

export type Option = {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  imageUrl?: string;
  thumbnail?: string;
  videoType?: 'UPLOAD' | 'YOUTUBE';
  videoUrl?: string;
  youtubeId?: string;
  publishedAt?: string;
  startsAt?: string;
  location?: string;
  category?: { name?: string };
  type: Exclude<ContentType, 'MIXED'>;
};

export type Section = {
  id: string;
  name: string;
  kind: string;
  layout: string;
  design: Design;
  source: string;
  contentType: ContentType;
  itemCount: number;
  contentIds: string[];
  displayFields: Field[];
  displayOrder: number;
  enabled: boolean;
};
