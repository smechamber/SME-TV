import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Video = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  videoType: 'UPLOAD' | 'YOUTUBE';
  videoUrl?: string | null;
  youtubeId?: string | null;
  thumbnail?: string | null;
  publishedAt?: string | null;
};
type EventItem = {
  id: string;
  title: string;
  startsAt: string;
  location?: string | null;
  clickUrl: string;
};
type Promo = {
  id: string;
  name: string;
  imageUrl: string;
  clickUrl: string;
  placement: 'ARTICLE_LIST' | 'BELOW_SEARCH' | 'BELOW_EVENTS';
  articlePosition: number;
};

async function getVideos(): Promise<Video[]> {
  const videos: Video[] = [];
  let offset = 0;
  while (true) {
    try {
      const response = await fetch(`${API}/api/videos?limit=50&offset=${offset}`, {
        next: { revalidate: 60 },
      });
      if (!response.ok) break;
      const payload = (await response.json()) as {
        data?: Video[];
        pagination?: { total?: number };
      };
      const batch = payload.data ?? [];
      videos.push(...batch);
      offset += batch.length;
      if (!batch.length || offset >= (payload.pagination?.total ?? offset)) break;
    } catch {
      break;
    }
  }
  return videos;
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

async function getPromos(): Promise<Promo[]> {
  try {
    const response = await fetch(`${API}/api/videos-page`, { cache: 'no-store' });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: Promo[] };
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

function plainText(value: string) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function thumbnailFor(video: Video) {
  if (video.thumbnail) return video.thumbnail;
  if (video.videoType === 'YOUTUBE' && /^[\w-]{11}$/.test(video.youtubeId ?? ''))
    return `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  return undefined;
}

function PromoCard({ promo }: { promo: Promo }) {
  return (
    <a
      href={promo.clickUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={promo.name}
      className="block aspect-video w-full overflow-hidden rounded bg-slate-100"
    >
      <img src={promo.imageUrl} alt={promo.name} className="h-full w-full object-contain" />
    </a>
  );
}

export default async function VideosPage({
  searchParams,
}: {
  searchParams?: { q?: string; archive?: string };
}) {
  const [videos, events, promos] = await Promise.all([getVideos(), getEvents(), getPromos()]);
  const query = searchParams?.q?.trim() ?? '';
  const archive = searchParams?.archive?.trim() ?? '';
  const filtered = videos.filter((video) => {
    const text = `${video.title} ${plainText(video.description ?? '')}`.toLowerCase();
    const matchesQuery = !query || text.includes(query.toLowerCase());
    const matchesArchive =
      !archive || (video.publishedAt && monthKey(video.publishedAt) === archive);
    return matchesQuery && matchesArchive;
  });
  const currentMonth = new Date().toISOString().slice(0, 7);
  const archives = [
    ...new Set(
      videos
        .map((video) => video.publishedAt)
        .filter((date): date is string => Boolean(date))
        .map(monthKey)
        .filter((month) => month < currentMonth),
    ),
  ].sort((a, b) => b.localeCompare(a));

  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: 'Videos' }]} />
      <AdSlot slot="VIDEO_LIST_TOP" />
      <span className="text-[12px] font-extrabold tracking-[.16em] text-[#d92867]">
        SME TV VIDEOS
      </span>
      <h1 className="my-3 text-4xl font-bold leading-tight tracking-[-.05em] text-[#1b1930] sm:text-4xl">
        Videos &amp; interviews
      </h1>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-[#6e6b7c] sm:text-base">
        Business stories and conversations from across the SME community.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-label="Videos" className="space-y-5">
          {filtered.length ? (
            filtered.map((video, index) => {
              const href = `/videos/${encodeURIComponent(video.slug || video.id)}`;
              const thumbnail = thumbnailFor(video);
              const summary = plainText(video.description ?? '');
              return (
                <div key={video.id} className="space-y-5">
                  <article className="grid gap-4 border-b border-slate-200 pb-5 sm:grid-cols-[minmax(190px,42%)_minmax(0,1fr)] sm:items-start">
                    <Link
                      href={href}
                      aria-label={`Open ${video.title}`}
                      className="relative block aspect-video overflow-hidden bg-[#261d36] sm:mt-1"
                    >
                      {thumbnail ? (
                        <img src={thumbnail} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-[#261d36] text-2xl font-extrabold text-white">
                          SME TV
                        </div>
                      )}
                      <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#e11d48] text-white">
                        ▶
                      </span>
                    </Link>
                    <div>
                      {video.publishedAt && (
                        <time className="text-[11px] font-medium uppercase tracking-wide text-[#777386]">
                          Published:{' '}
                          {new Date(video.publishedAt).toLocaleString('en-IN', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                      )}
                      <h2 className="mt-1 text-xl font-bold leading-tight text-[#17152b] sm:text-2xl">
                        <Link href={href} className="hover:text-[#d92867]">
                          {video.title}
                        </Link>
                      </h2>
                      {summary && (
                        <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#393746]">
                          {summary}
                        </p>
                      )}
                      <span className="mt-2 block text-[11px] font-bold uppercase tracking-wide text-[#d92867]">
                        {video.videoType === 'YOUTUBE' ? 'YouTube video' : 'SME TV video'}
                      </span>
                    </div>
                  </article>
                  {promos
                    .filter(
                      (promo) =>
                        promo.placement === 'ARTICLE_LIST' && promo.articlePosition === index + 1,
                    )
                    .map((promo) => (
                      <PromoCard key={promo.id} promo={promo} />
                    ))}
                </div>
              );
            })
          ) : (
            <p className="rounded border border-slate-200 p-5 text-sm text-[#6e6b7c]">
              {query
                ? `No videos found for “${query}”.`
                : archive
                  ? `No videos found for ${monthLabel(archive)}.`
                  : 'No videos have been published yet. Please check back soon.'}
            </p>
          )}
        </section>

        <aside className="space-y-7">
          <form action="/videos" method="GET" role="search">
            {archive && <input type="hidden" name="archive" value={archive} />}
            <label htmlFor="video-search" className="mb-2 block text-sm font-bold text-[#1b1930]">
              Search videos
            </label>
            <div className="flex">
              <input
                id="video-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search videos..."
                className="min-w-0 flex-1 border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#d92867]"
              />
              <button
                type="submit"
                className="bg-[#1e1b4b] px-4 text-sm font-bold text-white hover:bg-[#302b70]"
              >
                Search
              </button>
            </div>
          </form>
          {promos
            .filter((promo) => promo.placement === 'BELOW_SEARCH')
            .map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}

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
                    <a
                      href={event.clickUrl}
                      className="mt-1 block text-sm font-bold leading-snug text-[#1b1930] hover:text-[#d92867]"
                    >
                      {event.title}
                    </a>
                    {event.location && (
                      <span className="mt-1 block text-xs text-[#777386]">{event.location}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-[#6e6b7c]">No upcoming events at the moment.</p>
            )}
            <Link
              href="/events"
              className="mt-2 inline-block text-xs font-bold text-[#d92867] hover:underline"
            >
              View all events
            </Link>
          </section>
          {promos
            .filter((promo) => promo.placement === 'BELOW_EVENTS')
            .map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}

          <section>
            <h2 className="border-b-2 border-[#d92867] pb-2 text-base font-extrabold text-[#1b1930]">
              Archives
            </h2>
            {archives.length ? (
              <ul className="divide-y divide-slate-200">
                {archives.map((month) => (
                  <li key={month}>
                    <Link
                      href={`/videos?archive=${month}`}
                      className="block py-2.5 text-sm text-[#343140] hover:text-[#d92867]"
                    >
                      {monthLabel(month)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-[#6e6b7c]">No archived videos yet.</p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
