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
  description: z.string().min(1).max(20000),
  imageUrl: z.string().url().optional().or(z.literal('')),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  location: z.string().max(300).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED', 'POSTPONED', 'CANCELLED']).default('DRAFT'),
  registrationClose: z.string().datetime().optional(),
  capacity: z.number().int().positive().optional(),
});
