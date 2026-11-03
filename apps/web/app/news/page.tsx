import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category?: { name?: string };
  publishedAt?: string;
};

async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API}/api/news?limit=50`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: Article[] };
    return payload.data ?? [];
  } catch {
    return [];
  }
}

export default async function NewsPage({ searchParams }: { searchParams?: { category?: string } }) {
  const articles = await getArticles();
  const category = searchParams?.category?.trim();
  const filtered = category
    ? articles.filter((item) => item.category?.name?.toLowerCase() === category.toLowerCase())
    : articles;
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
      <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">SME TV NEWS</span>
      <h1 className="my-3 text-4xl font-black leading-tight tracking-[-.05em] text-[#1b1930] sm:text-5xl">{category ? `${category} news` : 'Latest news'}</h1>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-[#6e6b7c] sm:text-base">Reporting, ideas and perspectives from India’s SME community.</p>
      {filtered.length ? (
        <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article className="min-h-[205px] border-t-2 border-[#eadfe8] bg-[#fffaf8] p-6" key={item.id}>
              <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#d92867]">{item.category?.name ?? 'SME NEWS'}</span>
              <h3 className="mt-4 text-lg font-bold leading-snug text-[#1b1930] hover:text-[#d92867]">
                <Link href={`/news/${item.slug}`}>{item.title}</Link>
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6e6b7c]">{item.summary}</p>
              <time className="mt-3 block text-xs text-[#8d8795]">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-IN') : ''}
              </time>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-6 flex items-center gap-4 rounded-lg bg-[#fffaf8] p-6 text-sm text-[#6e6b7c]">
          {category
            ? `No ${category} stories are published yet.`
            : 'No stories are published yet. Please check back soon.'}
        </p>
      )}
      {category && (
        <p className="mt-6 text-sm">
          <Link href="/news" className="font-bold text-[#d92867]">
            View all news
          </Link>
        </p>
      )}
    </main>
  );
}
