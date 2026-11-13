import Link from 'next/link';
import type { EventItem } from '../../home-data';

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
        {items.slice(0, 3).map((event) => {
          const startsAt = new Date(event.startsAt);
          return (
            <a
              aria-label={`Know more about ${event.title}`}
              className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg"
              href={event.clickUrl}
              key={event.id}
            >
              <div className="relative aspect-[1.55] overflow-hidden bg-slate-100">
                {event.imageUrl ? (
                  <img alt={event.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" src={event.imageUrl} />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#e11d48] px-6 text-center text-white">
                    <span className="text-[10px] font-black uppercase tracking-[.2em] text-rose-100">{event.eventType || 'SME TV EVENTS'}</span>
                    <span className="mt-3 line-clamp-3 text-xl font-extrabold leading-snug">{event.title}</span>
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-md bg-[#1e1b4b]/95 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.15em] text-white shadow-sm">
                  {event.eventType || 'SME TV EVENT'}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-extrabold leading-7 text-[#1e1b4b] transition-colors group-hover:text-[#d92867]">{event.title}</h3>
                <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <time className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-[#fff1f2] text-[#1e1b4b] ring-1 ring-inset ring-rose-100">
                    <span className="text-2xl font-black leading-none">{startsAt.toLocaleDateString('en-IN', { day: '2-digit' })}</span>
                    <span className="mt-1 text-[9px] font-extrabold uppercase leading-none tracking-wider text-[#e11d48]">{startsAt.toLocaleDateString('en-IN', { month: 'short' })}</span>
                  </time>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#282338]">{event.location || 'Location to be announced'}</p>
                    <p className="mt-1 text-[11px] font-medium text-slate-500">{startsAt.toLocaleDateString('en-IN', { year: 'numeric' })}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#e11d48] px-3 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-white transition-colors group-hover:bg-[#c91d42]">
                    Know more <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </a>
          );
        })}
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
