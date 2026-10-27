export type ManagedContent = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  description?: string | null;
  summary?: string;
  content?: string;
  videoType?: string;
  videoUrl?: string | null;
  youtubeId?: string | null;
  imageUrl?: string | null;
  isFeatured?: boolean;
  isBreaking?: boolean;
  category?: { name: string } | null;
};
