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
  location?: string;
  startsAt: string;
  tag?: string;
};

export const TOPICS = [
  'All',
  'Policy & MSME',
  'Business',
  'Finance',
  'Exports',
  'Startups',
  'Technology',
  'Markets',
];

export type ContentFilter = (text: string) => boolean;
