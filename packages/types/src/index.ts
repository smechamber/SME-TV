export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Video = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  videoType: 'UPLOAD' | 'YOUTUBE';
  videoUrl: string | null;
  youtubeId: string | null;
  thumbnail: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
};
