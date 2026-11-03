import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Article = { id: string; title: string; slug: string; summary: string; category?: { name?: string }; publishedAt?: string };

async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API}/api/news?limit=50`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: Article[] };
    return payload.data ?? [];
  } catch { return []; }
}

export default async function NewsPage({ searchParams }: { searchParams?: { category?: string } }) {
  const articles = await getArticles();
  const category = searchParams?.category?.trim();
  const filtered = category ? articles.filter(item => item.category?.name?.toLowerCase() === category.toLowerCase()) : articles;
  return <main className="site-width content-section">
    <span className="eyebrow">SME TV NEWSROOM</span>
    <h1 className="listing-title">{category ? `${category} news` : 'Latest news'}</h1>
    <p className="listing-intro">Reporting, ideas and perspectives from India’s SME community.</p>
    {filtered.length ? <div className="story-grid">
      {filtered.map(item => <article className="story-card" key={item.id}>
        <span className="story-category">{item.category?.name ?? 'SME NEWS'}</span>
        <h3><Link href={`/news/${item.slug}`}>{item.title}</Link></h3>
        <p>{item.summary}</p>
        <time>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-IN') : ''}</time>
      </article>)}
    </div> : <p className="empty-stories">{category ? `No ${category} stories are published yet.` : 'No stories are published yet. Please check back soon.'}</p>}
    {category && <p className="mt-6 text-sm"><Link href="/news" className="font-bold text-[#d92867]">View all news</Link></p>}
  </main>;
}
