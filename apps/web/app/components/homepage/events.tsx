import Link from 'next/link';
import type { EventItem } from '../../home-data';
import EventCard from '../EventCard';

export function UpcomingEventCards({ items }: { items: EventItem[] }) {
  if (!items.length) return null;
  return (
    <section className="space-y-5" aria-labelledby="upcoming-events">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <h2 id="upcoming-events" className="text-2xl font-bold text-[#1e1b4b]">
          Upcoming Events
        </h2>
        <Link href="/events" className="shrink-0 text-sm font-semibold text-[#1e1b4b] hover:text-[#e11d48]">
          View all <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 3).map((event) => (
          <EventCard item={event} key={event.id} />
        ))}
      </div>
    </section>
  );
}

export function EventCards({ items }: { items: EventItem[] }) {
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((event) => (
          <article
            className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            key={event.id}
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
            <a
              href={event.clickUrl}
              className="text-xs font-bold uppercase tracking-wider text-[#1e1b4b] hover:text-[#e11d48]"
            >
              Event Details & Registration →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MixedEventLead({ item }: { item: EventItem }) {
  return (
    <article className="flex min-h-[440px] flex-col justify-between rounded-2xl bg-[#1e1b4b] p-6 text-white shadow-md md:min-h-[500px] md:p-8">
      <div>
        <span className="rounded bg-[#e11d48] px-3 py-1 text-[10px] font-black uppercase tracking-widest">
          EVENT
        </span>
        <h1 className="mt-5 text-3xl font-black leading-tight md:text-4xl">{item.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">{item.description}</p>
      </div>
      <div>
        <p className="mb-4 text-sm font-semibold text-slate-300">
          {new Date(item.startsAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          {item.location ? ` · ${item.location}` : ''}
        </p>
        <a
          href={item.clickUrl}
          className="inline-flex rounded-lg bg-[#e11d48] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700"
        >
          Event Details →
        </a>
      </div>
    </article>
  );
}
