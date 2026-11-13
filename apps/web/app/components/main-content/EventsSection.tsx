import Link from 'next/link';
import EventCard from '../EventCard';
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
          className="grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Loading events"
        >
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-40 rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard item={event} key={event.id} />
          ))}
        </div>
      )}
    </section>
  );
}
