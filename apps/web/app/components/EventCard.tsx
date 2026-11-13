import type { EventItem } from '../home-data';

export default function EventCard({
  item,
  href = item.clickUrl,
}: {
  item: EventItem;
  href?: string;
}) {
  const startsAt = new Date(item.startsAt);
  const validDate = !Number.isNaN(startsAt.getTime());

  return (
    <a
      href={href}
      aria-label={`Know more about ${item.title}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_12px_35px_rgba(30,27,75,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e11d48]"
    >
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

      <div className="flex flex-1 flex-col px-4 py-3">
        <div className="mb-2">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c0265b]">
            <span className="break-words leading-relaxed">{item.eventType || 'SME TV EVENT'}</span>
          </span>
        </div>

        <h2 className="line-clamp-2 min-h-[2.5rem] text-lg font-bold leading-7 text-[#1e1b4b] transition-colors group-hover:text-[#d92867]">
          {item.title}
        </h2>

        <div className="mt-auto pt-5">
          <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
            <div className="flex h-[58px] w-[58px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#fff1f4]">
              {validDate ? (
                <>
                  <span className="text-[23px] font-extrabold leading-none text-[#1e1b4b]">
                    {startsAt.toLocaleDateString('en-IN', { day: '2-digit' })}
                  </span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#d92867]">
                    {startsAt.toLocaleDateString('en-IN', { month: 'short' })}
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-bold text-[#d92867]">TBA</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#282338]">
                {item.location || 'Location to be announced'}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {validDate
                  ? startsAt.toLocaleDateString('en-IN', { year: 'numeric' })
                  : 'Date to be announced'}
              </p>
            </div>

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
}
