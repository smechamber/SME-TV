import 'dotenv/config';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import cors from 'cors';
import express, { type ErrorRequestHandler, type Request } from 'express';
import helmet from 'helmet';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { db } from '@sme-tv/db';

const app = express();
app.use(helmet());
const origins = (process.env.API_CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:3001').split(',').map(x => x.trim());
if (process.env.NODE_ENV !== 'production' && !origins.includes('http://localhost:3001')) origins.push('http://localhost:3001');
app.use(cors({ origin: (origin, done) => !origin || origins.includes(origin) ? done(null, true) : done(new Error('Origin is not allowed')) }));
app.use(express.json({ limit: '1mb' }));
const slugify = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const sanitizeArticleHtml = (html: string) => sanitizeHtml(html, {
  allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'br', 'iframe'],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    iframe: ['src', 'width', 'height', 'title', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy'],
  },
  allowedIframeHostnames: ['www.youtube-nocookie.com'],
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
});
const eventForm = z.object({ name: z.string().trim().min(2).max(120), designation: z.string().trim().min(2).max(120), companyName: z.string().trim().min(2).max(160), businessActivity: z.string().trim().min(2).max(500), specificInterest: z.string().trim().min(2).max(500), email: z.string().trim().email().max(254), mobile: z.string().trim().regex(/^\+?[0-9 ()-]{8,20}$/), city: z.string().trim().min(2).max(120), state: z.string().trim().min(2).max(120), consent: z.literal(true) });
const articleForm = z.object({ title: z.string().trim().min(5).max(180), slug: z.string().trim().min(2).max(190).optional(), summary: z.string().trim().min(10).max(500), content: z.string().min(1).max(100000), imageUrl: z.string().url().optional().or(z.literal('')), status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'), isFeatured: z.boolean().default(false), isBreaking: z.boolean().default(false), category: z.string().trim().max(80).optional() });
const videoForm = z.object({ title: z.string().trim().min(3).max(180), description: z.string().max(5000).optional(), videoType: z.enum(['UPLOAD', 'YOUTUBE']), videoUrl: z.string().url().optional().or(z.literal('')), youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/).optional(), thumbnail: z.string().url().optional().or(z.literal('')), status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'), isFeatured: z.boolean().default(false) });
const eventFormCreate = z.object({ title: z.string().trim().min(3).max(180), description: z.string().min(1).max(20000), imageUrl: z.string().url().optional().or(z.literal('')), startsAt: z.string().datetime(), endsAt: z.string().datetime().optional(), location: z.string().max(300).optional(), status: z.enum(['DRAFT', 'PUBLISHED', 'COMPLETED', 'POSTPONED', 'CANCELLED']).default('DRAFT'), registrationClose: z.string().datetime().optional(), capacity: z.number().int().positive().optional() });
const authWindows = new Map<string, { count: number; resetAt: number }>();
function authRateLimit(request: Request, response: express.Response, next: express.NextFunction) {
  const key = request.ip || 'unknown';
  const now = Date.now();
  const window = authWindows.get(key);
  if (!window || window.resetAt <= now) authWindows.set(key, { count: 1, resetAt: now + 60_000 });
  else if (window.count >= 10) return response.status(429).json({ success: false, message: 'Too many attempts. Try again in a minute.' });
  else window.count++;
  next();
}

type AuthRequest = Request & { user?: { id: string; role: string } };
async function authenticate(request: AuthRequest, response: express.Response, next: express.NextFunction) {
  const token = request.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return response.status(401).json({ success: false, message: 'Sign in required' });
  const session = await db.session.findUnique({ where: { tokenHash: hash(token) }, include: { user: true } });
  if (!session || session.expiresAt < new Date() || session.user.status !== 'ACTIVE') return response.status(401).json({ success: false, message: 'Session expired' });
  request.user = { id: session.user.id, role: session.user.role };
  next();
}
function requireAdmin(request: AuthRequest, response: express.Response, next: express.NextFunction) {
  if (!request.user || !['ADMIN', 'EDITOR'].includes(request.user.role)) return response.status(403).json({ success: false, message: 'Administrator access required' });
  next();
}
function asyncRoute(handler: (request: AuthRequest, response: express.Response) => Promise<unknown>) {
  return (request: Request, response: express.Response, next: express.NextFunction) => Promise.resolve(handler(request as AuthRequest, response)).catch(next);
}

app.get('/', (_request, response) => response.json({ name: 'SME-TV API', status: 'ok' }));
app.get('/api/health', (_request, response) => response.json({ success: true, message: 'SME-TV API is running' }));
app.get('/api/news', asyncRoute(async (request, response) => {
  const limit = Math.max(1, Math.min(50, Number(request.query.limit) || 12));
  const where = { status: 'PUBLISHED' as const, publishedAt: { lte: new Date() } };
  const [data, total] = await Promise.all([db.article.findMany({ where, take: limit, orderBy: { publishedAt: 'desc' }, include: { category: { select: { name: true } } } }), db.article.count({ where })]);
  response.json({ success: true, data, pagination: { total, limit } });
}));
app.get('/api/news/:slug', asyncRoute(async (request, response) => {
  const data = await db.article.findFirst({ where: { slug: String(request.params.slug), status: 'PUBLISHED', publishedAt: { lte: new Date() } }, include: { category: true } });
  if (!data) return response.status(404).json({ success: false, message: 'Article not found' });
  data.content = sanitizeArticleHtml(data.content);
  response.json({ success: true, data });
}));
app.get('/api/videos', asyncRoute(async (_request, response) => {
  const data = await db.video.findMany({ where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } }, orderBy: { publishedAt: 'desc' }, take: 30 });
  response.json({ success: true, data });
}));
app.get('/api/events', asyncRoute(async (_request, response) => {
  const data = await db.event.findMany({ where: { status: 'PUBLISHED', startsAt: { gte: new Date() } }, orderBy: { startsAt: 'asc' }, take: 30 });
  response.json({ success: true, data });
}));
app.post('/api/auth/register', authRateLimit, asyncRoute(async (request, response) => {
  const input = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(254), password: z.string().min(10).max(128) }).parse(request.body);
  const salt = randomBytes(16).toString('hex');
  const passwordHash = `${salt}:${scryptSync(input.password, salt, 64).toString('hex')}`;
  const user = await db.user.create({ data: { name: input.name, email: input.email.toLowerCase(), passwordHash } });
  response.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email } });
}));
app.post('/api/auth/login', authRateLimit, asyncRoute(async (request, response) => {
  const input = z.object({ email: z.string().email(), password: z.string().min(1).max(128) }).parse(request.body);
  const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
  const [salt, expected] = user?.passwordHash?.split(':') ?? ['', ''];
  const actual = scryptSync(input.password, salt || 'invalid', 64).toString('hex');
  const valid = Boolean(expected) && timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
  if (!user || !valid || user.status !== 'ACTIVE') return response.status(401).json({ success: false, message: 'Invalid email or password' });
  const token = randomBytes(32).toString('base64url');
  await db.session.create({ data: { userId: user.id, tokenHash: hash(token), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) } });
  response.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
}));
app.get('/api/auth/me', authenticate, asyncRoute(async (request, response) => {
  const user = await db.user.findUnique({ where: { id: request.user!.id }, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
  response.json({ success: true, data: user });
}));
app.put('/api/auth/me', authenticate, asyncRoute(async (request, response) => {
  const input = z.object({ name: z.string().trim().min(2).max(120), phone: z.string().trim().regex(/^\+?[0-9 ()-]{8,20}$/).optional() }).parse(request.body);
  const user = await db.user.update({ where: { id: request.user!.id }, data: input, select: { id: true, name: true, email: true, phone: true, role: true } });
  response.json({ success: true, data: user });
}));
app.get('/api/admin/stats', authenticate, requireAdmin, asyncRoute(async (_request, response) => {
  const [publishedArticles, drafts, videos, upcomingEvents, registrations, users] = await Promise.all([db.article.count({ where: { status: 'PUBLISHED' } }), db.article.count({ where: { status: 'DRAFT' } }), db.video.count({ where: { status: 'PUBLISHED' } }), db.event.count({ where: { status: 'PUBLISHED', startsAt: { gte: new Date() } } }), db.eventRegistration.count(), db.user.count()]);
  response.json({ success: true, data: { publishedArticles, drafts, videos, upcomingEvents, registrations, users } });
}));
app.get('/api/admin/registrations', authenticate, requireAdmin, asyncRoute(async (request, response) => {
  const limit = Math.max(1, Math.min(100, Number(request.query.limit) || 50));
  const data = await db.eventRegistration.findMany({ take: limit, orderBy: { createdAt: 'desc' }, include: { event: { select: { title: true, startsAt: true } } } });
  response.json({ success: true, data });
}));
app.post('/api/admin/news', authenticate, requireAdmin, asyncRoute(async (request, response) => {
  const input = articleForm.parse(request.body);
  const slug = slugify(input.slug || input.title);
  const category = input.category ? await db.category.upsert({ where: { slug: slugify(input.category) }, update: {}, create: { name: input.category, slug: slugify(input.category) } }) : undefined;
  const data = await db.article.create({ data: { title: input.title, slug, summary: input.summary, content: sanitizeArticleHtml(input.content), imageUrl: input.imageUrl || null, status: input.status, isFeatured: input.isFeatured, isBreaking: input.isBreaking, publishedAt: input.status === 'PUBLISHED' ? new Date() : null, authorId: request.user!.id, categoryId: category?.id } });
  response.status(201).json({ success: true, data });
}));
app.post('/api/admin/videos', authenticate, requireAdmin, asyncRoute(async (request, response) => {
  const input = videoForm.parse(request.body);
  const youtubeId = input.videoType === 'YOUTUBE' ? (input.youtubeId ?? input.videoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)?.[1]) : undefined;
  if (input.videoType === 'YOUTUBE' && !youtubeId) return response.status(400).json({ success: false, message: 'Provide a valid YouTube URL or video ID' });
  const data = await db.video.create({ data: { title: input.title, slug: slugify(input.title) + '-' + randomBytes(3).toString('hex'), description: input.description, videoType: input.videoType, videoUrl: input.videoType === 'UPLOAD' ? input.videoUrl : null, youtubeId, thumbnail: input.thumbnail, status: input.status, isFeatured: input.isFeatured, publishedAt: input.status === 'PUBLISHED' ? new Date() : null, authorId: request.user!.id } });
  response.status(201).json({ success: true, data });
}));
app.post('/api/admin/events', authenticate, requireAdmin, asyncRoute(async (request, response) => {
  const input = eventFormCreate.parse(request.body);
  const data = await db.event.create({ data: { ...input, slug: slugify(input.title) + '-' + randomBytes(3).toString('hex'), imageUrl: input.imageUrl || null, startsAt: new Date(input.startsAt), endsAt: input.endsAt ? new Date(input.endsAt) : null, registrationClose: input.registrationClose ? new Date(input.registrationClose) : null } });
  response.status(201).json({ success: true, data });
}));
app.post('/api/events/:id/register', authRateLimit, asyncRoute(async (request, response) => {
  const input = eventForm.parse(request.body);
  const event = await db.event.findFirst({ where: { id: String(request.params.id), status: 'PUBLISHED', startsAt: { gte: new Date() } } });
  if (!event || (event.registrationClose && event.registrationClose < new Date())) return response.status(404).json({ success: false, message: 'Registration is closed for this event' });
  const count = await db.eventRegistration.count({ where: { eventId: event.id } });
  if (event.capacity && count >= event.capacity) return response.status(409).json({ success: false, message: 'This event has reached capacity' });
  const data = await db.eventRegistration.create({ data: { ...input, eventId: event.id } });
  response.status(201).json({ success: true, data: { id: data.id, message: 'Registration received' } });
}));
app.post('/api/auth/logout', authenticate, asyncRoute(async (request, response) => {
  const token = request.header('authorization')!.replace(/^Bearer\s+/i, '');
  await db.session.deleteMany({ where: { tokenHash: hash(token) } });
  response.json({ success: true });
}));
app.use((error: unknown, _request: Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) return response.status(400).json({ success: false, message: 'Invalid request', errors: error.flatten().fieldErrors });
  if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') return response.status(409).json({ success: false, message: 'A record with this information already exists' });
  nextError(error, response);
});
function nextError(error: unknown, response: express.Response) {
  console.error(error);
  response.status(500).json({ success: false, message: 'Internal server error' });
}
const port = Number(process.env.API_PORT ?? 4000);
app.listen(port, () => console.log(`SME-TV API listening on http://localhost:${port}`));


