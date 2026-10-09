import type { MetadataRoute } from 'next';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://smetv.in';
type Entry = { slug: string; publishedAt?: string; startsAt?: string };
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = ['/', '/news', '/videos', '/events', '/about', '/login', '/register'].map(path => ({ url: `${SITE}${path}`, changeFrequency: 'daily', priority: path === '/' ? 1 : 0.6 }));
  try {
    const [newsResponse, eventResponse] = await Promise.all([fetch(`${API}/api/news?limit=50`, { next: { revalidate: 3600 } }), fetch(`${API}/api/events`, { next: { revalidate: 3600 } })]);
    const [news, events] = await Promise.all([newsResponse.ok ? newsResponse.json() : Promise.resolve({ data: [] }), eventResponse.ok ? eventResponse.json() : Promise.resolve({ data: [] })]) as [{ data?: Entry[] }, { data?: Entry[] }];
    return [...base, ...(news.data ?? []).map(item => ({ url: `${SITE}/news/${item.slug}`, lastModified: item.publishedAt ? new Date(item.publishedAt) : undefined, changeFrequency: 'weekly' as const, priority: 0.7 })), ...(events.data ?? []).map(item => ({ url: `${SITE}/events/${item.slug}`, lastModified: item.startsAt ? new Date(item.startsAt) : undefined, changeFrequency: 'weekly' as const, priority: 0.6 }))];
  } catch { return base; }
}
