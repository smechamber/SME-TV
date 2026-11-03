import Link from 'next/link';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type EventItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  startsAt: string;
  location?: string;
};
async function getEvents(): Promise<EventItem[]> {
  try {
    const r = await fetch(`${API}/api/events`, { next: { revalidate: 60 } });
    if (!r.ok) return [];
    const p = (await r.json()) as { data?: EventItem[] };
    return p.data ?? [];
  } catch {
    return [];
  }
}
export default async function EventsPage() {
  const events = await getEvents();
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
      <Link className="mb-6 inline-block text-xs font-bold text-[#d92867] hover:underline" href="/">
        ? Home
      </Link>
      <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">CONNECT WITH THE COMMUNITY</span>
      <h1 className="my-3 text-4xl font-black leading-tight tracking-[-.05em] text-[#1b1930] sm:text-5xl">Upcoming events</h1>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-[#6e6b7c] sm:text-base">Meet the people and ideas shaping India’s SME ecosystem.</p>
      {events.length ? (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {events.map((item) => (
            <article className="border-t-2 border-[#d92867] bg-[#fffaf8] p-6" key={item.id}>
              <time className="text-xs font-bold text-[#d92867]">
                {new Date(item.startsAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <h2 className="mt-3 text-xl font-bold leading-snug text-[#1b1930]">
                <Link href={`/events/${item.slug}`}>{item.title}</Link>
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#6e6b7c]">{item.location ?? 'Location to be announced'}</p>
              <p className="mt-3 text-sm leading-6 text-[#6e6b7c]">{item.description}</p>
              <Link className="mt-4 inline-flex items-center justify-center gap-2 rounded bg-[#d92867] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b81d53] disabled:cursor-not-allowed disabled:opacity-60" href={`/events/${item.slug}`}>
                Event details ?
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-4 rounded-lg bg-[#fffaf8] p-6 text-sm text-[#6e6b7c]">
          No upcoming events at the moment. Please check back soon.
        </div>
      )}
    </main>
  );
}
