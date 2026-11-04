import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl?: string | null;
  category?: { name?: string } | null;
  publishedAt?: string;
};
type EventItem = {
  id: string;
  title: string;
  slug: string;
  startsAt: string;
  location?: string | null;
};

async function getArticles(): Promise<Article[]> {
  const articles: Article[] = [];
  let offset = 0;

  while (true) {
    try {
      const response = await fetch(`${API}/api/news?limit=50&offset=${offset}`, {
        next: { revalidate: 60 },
      });
      if (!response.ok) break;
      const payload = (await response.json()) as {
        data?: Article[];
        pagination?: { total?: number };
      };
      const batch = payload.data ?? [];
      articles.push(...batch);
      offset += batch.length;
      if (!batch.length || offset >= (payload.pagination?.total ?? offset)) break;
    } catch {
      break;
    }
  }

  return articles;
}

async function getEvents(): Promise<EventItem[]> {
  try {
    const response = await fetch(`${API}/api/events`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: EventItem[] };
    return payload.data ?? [];
  } catch {
    return [];
  }
}

function monthKey(date: string) {
  return new Date(date).toISOString().slice(0, 7);
}

function monthLabel(key: string) {
  const [year, month] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: { category?: string; q?: string; archive?: string };
}) {
  const [articles, events] = await Promise.all([getArticles(), getEvents()]);
  const category = searchParams?.category?.trim();
  const query = searchParams?.q?.trim() ?? '';
  const archive = searchParams?.archive?.trim() ?? '';
  const filtered = articles.filter((item) => {
    const matchesCategory =
      !category || item.category?.name?.toLowerCase() === category.toLowerCase();
    const searchableText = `${item.title} ${item.summary} ${item.category?.name ?? ''}`.toLowerCase();
    const matchesQuery = !query || searchableText.includes(query.toLowerCase());
    const matchesArchive = !archive || (item.publishedAt && monthKey(item.publishedAt) === archive);
    return matchesCategory && matchesQuery && matchesArchive;
  });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const archives = [...new Set(
    articles
      .map((item) => item.publishedAt)
      .filter((date): date is string => Boolean(date))
      .map(monthKey)
      .filter((month) => month < currentMonth),
  )].sort((a, b) => b.localeCompare(a));

  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
      <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">SME TV NEWS</span>
      <h1 className="my-3 text-4xl font-black leading-tight tracking-[-.05em] text-[#1b1930] sm:text-5xl">
        {category ? `${category} news` : 'Latest news'}
      </h1>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-[#6e6b7c] sm:text-base">
        Reporting, ideas and perspectives from India’s SME community.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-label="News articles" className="space-y-5">
          {filtered.length ? (
            filtered.map((item) => (
              <article
                className="grid gap-4 border-b border-slate-200 pb-5 sm:grid-cols-[minmax(0,1fr)_minmax(190px,42%)] sm:items-start"
                key={item.id}
              >
                <div>
                  {item.publishedAt && (
                    <time className="text-[11px] font-medium uppercase tracking-wide text-[#777386]">
                      Updated: {new Date(item.publishedAt).toLocaleString('en-IN', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  )}
                  <h2 className="mt-1 text-xl font-bold leading-tight text-[#17152b] sm:text-2xl">
                    <Link href={`/news/${item.slug}`} className="hover:text-[#d92867]">
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#393746]">{item.summary}</p>
                  <span className="mt-2 block text-[11px] font-bold uppercase tracking-wide text-[#d92867]">
                    {item.category?.name ?? 'SME News'}
                  </span>
                </div>
                {item.imageUrl && (
                  <Link href={`/news/${item.slug}`} className="block overflow-hidden sm:mt-1">
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="aspect-[16/9] w-full object-cover"
                    />
                  </Link>
                )}
              </article>
            ))
          ) : (
            <p className="rounded border border-slate-200 p-5 text-sm text-[#6e6b7c]">
              {query
                ? `No news articles found for “${query}”.`
                : archive
                  ? `No articles found for ${monthLabel(archive)}.`
                  : category
                    ? `No ${category} stories are published yet.`
                    : 'No stories are published yet. Please check back soon.'}
            </p>
          )}
        </section>

        <aside className="space-y-7">
          <form action="/news" method="GET" role="search">
            {category && <input type="hidden" name="category" value={category} />}
            {archive && <input type="hidden" name="archive" value={archive} />}
            <label htmlFor="story-search" className="mb-2 block text-sm font-bold text-[#1b1930]">
              Search news
            </label>
            <div className="flex">
              <input
                id="story-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search articles..."
                className="min-w-0 flex-1 border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#d92867]"
              />
              <button type="submit" className="bg-[#1e1b4b] px-4 text-sm font-bold text-white hover:bg-[#302b70]">
                Search
              </button>
            </div>
          </form>

          <section>
            <h2 className="border-b-2 border-[#d92867] pb-2 text-base font-extrabold text-[#1b1930]">
              Upcoming events
            </h2>
            {events.length ? (
              <ul className="divide-y divide-slate-200">
                {events.slice(0, 5).map((event) => (
                  <li key={event.id} className="py-3">
                    <time className="text-xs font-semibold text-[#d92867]">
                      {new Date(event.startsAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                    <Link href={`/events/${event.slug}`} className="mt-1 block text-sm font-bold leading-snug text-[#1b1930] hover:text-[#d92867]">
                      {event.title}
                    </Link>
                    {event.location && <span className="mt-1 block text-xs text-[#777386]">{event.location}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-[#6e6b7c]">No upcoming events at the moment.</p>
            )}
            <Link href="/events" className="mt-2 inline-block text-xs font-bold text-[#d92867] hover:underline">
              View all events
            </Link>
          </section>

          <section>
            <h2 className="border-b-2 border-[#d92867] pb-2 text-base font-extrabold text-[#1b1930]">
              Archives
            </h2>
            {archives.length ? (
              <ul className="divide-y divide-slate-200">
                {archives.map((month) => (
                  <li key={month}>
                    <Link
                      href={`/news?archive=${month}`}
                      className="block py-2.5 text-sm text-[#343140] hover:text-[#d92867]"
                    >
                      {monthLabel(month)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-[#6e6b7c]">No archived articles yet.</p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
