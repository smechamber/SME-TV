import { z } from 'zod';

export const articleForm = z.object({
  title: z.string().trim().min(5).max(180),
  slug: z.string().trim().min(2).max(190).optional(),
  summary: z.string().trim().min(10).max(500),
  content: z.string().min(1).max(100000),
  imageUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  isBreaking: z.boolean().default(false),
  category: z.string().trim().max(80).optional(),
});
