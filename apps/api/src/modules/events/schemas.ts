import { z } from 'zod';

export const registrationForm = z.object({
  name: z.string().trim().min(2).max(120),
  designation: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(2).max(160),
  businessActivity: z.string().trim().min(2).max(500),
  specificInterest: z.string().trim().min(2).max(500),
  email: z.string().trim().email().max(254),
  mobile: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{8,20}$/),
  city: z.string().trim().min(2).max(120),
  state: z.string().trim().min(2).max(120),
  consent: z.literal(true),
});

export const eventForm = z.object({
  title: z.string().trim().min(3).max(180),
  eventType: z.string().trim().max(120).optional().or(z.literal('')),
  description: z.string().max(20000).default(''),
  imageUrl: z.string().url().optional().or(z.literal('')),
  clickUrl: z
    .string()
    .url()
    .refine((value) => /^https?:\/\//i.test(value), 'URL must use HTTP or HTTPS')
    .refine((value) => value.trim().length > 0, 'Redirect URL is required'),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  location: z.string().max(300).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED', 'POSTPONED', 'CANCELLED']).default('DRAFT'),
  registrationClose: z.string().datetime().optional(),
  capacity: z.number().int().positive().optional(),
});
