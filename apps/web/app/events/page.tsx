import Breadcrumbs from '../../components/Breadcrumbs';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type EventItem = {
  id: string;
  slug: string;
  title: string;
  imageUrl?: string | null;
  clickUrl?: string | null;
  startsAt: string;
  location?: string | null;
};

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

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ label: 'Events' }]} />
      <span className="text-[12px] font-extrabold tracking-[.16em] text-[#d92867]">
        SME TV EVENTS &amp; OPPORTUNITIES
      </span>
      <h1 className="my-3 text-4xl font-bold leading-tight tracking-[-.05em] text-[#1b1930]">
        Business events &amp; opportunities
      </h1>
      {events.length ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((item) => {
            const startsAt = new Date(item.startsAt);
            return (
              <a
                aria-label={`Know more about ${item.title}`}
                className="group block overflow-hidden bg-[#f0f0f0] transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d92867]"
                href={item.clickUrl || `/events/${item.slug}`}
                key={item.id}
              >
                <div className="aspect-[1.55] overflow-hidden bg-[#e6e6e6]">
                  {item.imageUrl ? (
                    <img
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      src={item.imageUrl}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-lg font-bold text-[#777283]">
                      {item.title}
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <h2 className="font-serif text-lg leading-snug text-[#171717]">{item.title}</h2>
                  <div className="mt-5 flex items-center gap-3 border-t border-white/80 pt-4">
                    <time className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-white bg-white text-[#202020]">
                      <span className="text-2xl leading-none">
                        {startsAt.toLocaleDateString('en-IN', { day: '2-digit' })}
                      </span>
                      <span className="mt-1 text-[9px] font-semibold uppercase leading-none text-[#666]">
                        {startsAt.toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                    </time>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-[#171717]">
                        {item.location || startsAt.toLocaleDateString('en-IN', { year: 'numeric' })}
                      </p>
                      <span className="mt-2 block text-[10px] font-extrabold text-black">
                        KNOW MORE
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-4 rounded-lg bg-[#fffaf8] p-6 text-sm text-[#6e6b7c]">
          No upcoming events at the moment. Please check back soon.
        </div>
      )}
    </main>
  );
}
