import { z } from 'zod';

export const videoForm = z.object({
  title: z.string().trim().min(3).max(180),
  description: z.string().max(5000).optional(),
  videoType: z.enum(['UPLOAD', 'YOUTUBE']),
  videoUrl: z.string().url().optional().or(z.literal('')),
  youtubeId: z
    .string()
    .regex(/^[A-Za-z0-9_-]{11}$/)
    .optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
});
