import Breadcrumbs from '../../components/Breadcrumbs';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type EventItem = {
  id: string;
  slug: string;
  title: string;
  eventType?: string | null;
  imageUrl?: string | null;
  clickUrl: string;
  startsAt: string;
  location?: string | null;
};

async function getEvents(): Promise<EventItem[]> {
  try {
    const response = await fetch(`${API}/api/events?includePast=true`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as { data?: EventItem[] };
    return payload.data ?? [];
  } catch {
    return [];
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const events = await getEvents();
  const params = await searchParams;

  const activeFilter = params.filter === 'past' ? 'past' : 'upcoming';
  const now = new Date();

  const filteredEvents = events
    .filter((item) => {
      const date = new Date(item.startsAt);

      if (Number.isNaN(date.getTime())) return false;

      return activeFilter === 'upcoming' ? date >= now : date < now;
    })
    .sort((first, second) => {
      const difference = new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime();
      return activeFilter === 'upcoming' ? difference : -difference;
    });

  return (
    <main className="min-h-screen bg-[#fafafd]">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-4 sm:px-6 sm:py-6">
        <Breadcrumbs items={[{ label: 'Events' }]} />

        {/* Header */}
        <section>
          <span className="text-[12px] font-extrabold tracking-[.16em] text-[#d92867]">
            SME EVENTS
          </span>

          <h1 className="my-3 text-4xl font-bold leading-tight tracking-[-.05em] text-[#1b1930] sm:text-4xl">
            Business Events
          </h1>

          <p className="mb-6 max-w-3xl text-sm leading-6 text-[#6e6b7c] sm:text-base">
            Explore upcoming business events, networking opportunities and initiatives from the SME
            community.
          </p>
        </section>

        {/* Events */}
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-[#1e1b4b]">
            {activeFilter === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
          </h2>

          {/* Events Dropdown */}
          <details className="group relative shrink-0">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-[#1e1b4b] shadow-sm transition hover:border-[#d92867] sm:px-4 sm:text-sm">
              {activeFilter === 'upcoming' ? 'Upcoming Events' : 'Past Events'}

              <svg
                className="h-4 w-4 transition-transform group-open:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>

            <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
              <a
                href="?filter=upcoming"
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  activeFilter === 'upcoming'
                    ? 'bg-rose-50 text-[#d92867]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Upcoming Events
              </a>

              <a
                href="?filter=past"
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  activeFilter === 'past'
                    ? 'bg-rose-50 text-[#d92867]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Past Events
              </a>
            </div>
          </details>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((item) => {
              const startsAt = new Date(item.startsAt);
              const validDate = !Number.isNaN(startsAt.getTime());
              const eventUrl =
                validDate && startsAt < now
                  ? 'https://smeevents.in/events/past-events'
                  : item.clickUrl;

              return (
                <a
                  key={item.id}
                  href={eventUrl}
                  aria-label={`Know more about ${item.title}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_12px_35px_rgba(30,27,75,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48]"
                >
                  {/* Image */}
                  <div className="relative w-full overflow-hidden bg-slate-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="block h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-[#1e1b4b] to-[#d92867] px-6">
                        <h3 className="text-center text-xl font-extrabold leading-snug text-white">
                          {item.title}
                        </h3>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col px-4 py-3">
                    {/* Business Type */}
                    <div className="mb-2">
                      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c0265b]">
                        <span className="break-words leading-relaxed">
                          {item.eventType || 'SME TV EVENT'}
                        </span>
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-7 text-[#1e1b4b] transition-colors group-hover:text-[#d92867]">
                      {item.title}
                    </h2>

                    {/* Date & Location */}
                    <div className="mt-auto pt-5">
                      <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                        {/* Date */}
                        <div className="flex h-[58px] w-[58px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#fff1f4]">
                          {validDate ? (
                            <>
                              <span className="text-[23px] font-extrabold leading-none text-[#1e1b4b]">
                                {startsAt.toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                })}
                              </span>

                              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#d92867]">
                                {startsAt.toLocaleDateString('en-IN', {
                                  month: 'short',
                                })}
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px] font-bold text-[#d92867]">TBA</span>
                          )}
                        </div>

                        {/* Location */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#282338]">
                            {item.location || 'Location to be announced'}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {validDate
                              ? startsAt.toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                })
                              : 'Date to be announced'}
                          </p>
                        </div>

                        {/* Arrow */}
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e1b4b] text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#d92867]">
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#d92867]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#1e1b4b]">
              {activeFilter === 'upcoming' ? 'No upcoming events' : 'No past events'}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {activeFilter === 'upcoming'
                ? 'There are no upcoming events at the moment. Please check back soon for new opportunities.'
                : 'There are no past events available at the moment.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
