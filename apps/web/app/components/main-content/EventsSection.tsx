import Link from 'next/link';
import type { EventItem } from './types';

export default function EventsSection({
  events,
  filtered,
  loading,
}: {
  events: EventItem[];
  filtered: EventItem[];
  loading: boolean;
}) {
  if (!events.length && !loading) return null;
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
            SME TV EVENTS
          </small>
          <h2 className="text-2xl font-bold text-[#1e1b4b]">Business Events &amp; Opportunities</h2>
        </div>
        <Link
          href="/events"
          className="text-xs font-bold uppercase tracking-wider text-[#1e1b4b] hover:text-[#e11d48]"
        >
          Full Calendar →
        </Link>
      </div>
      {loading && !events.length ? (
        <div
          className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-3"
          aria-label="Loading events"
        >
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-40 rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {filtered.map((event) => (
            <article
              key={event.id}
              className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">
                    {new Date(event.startsAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {event.tag && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e11d48]">
                      {event.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold leading-snug text-slate-900">{event.title}</h3>
                <p className="text-xs leading-relaxed text-slate-600">{event.description}</p>
              </div>
              <Link
                href={`/events/${event.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-[#1e1b4b] transition-colors hover:text-[#e11d48]"
              >
                Event Details &amp; Registration →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
