import Link from 'next/link';
import type { HomepageItem } from '../../home-data';
import { isEvent, isStory, mixedHref, mixedImage, mixedMeta } from './helpers';

export function TrendingSection({ items }: { items: HomepageItem[] }) {
  if (!items.length) return null;

  return (
    <section className="space-y-5" aria-labelledby="trending-on-smetv">
      <div className="flex items-center gap-4">
        <h2
          id="trending-on-smetv"
          className="shrink-0 rounded-xl bg-[#1e1b4b] px-6 py-2 text-base font-medium uppercase tracking-wide text-white"
        >
          Trending on SMETV
        </h2>
        {/* <div className="h-px flex-1 bg-[#28206f]" /> */}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((item) => {
          const image = mixedImage(item);
          const description = isStory(item) ? item.summary : item.description;
          const metadata = isEvent(item)
            ? item.location
            : isStory(item) && item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Watch now';

          return (
            <Link
              key={item.id}
              href={mixedHref(item)}
              className="group grid min-h-[132px] grid-cols-[150px_1fr] overflow-hidden rounded border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#d8d3f2] hover:shadow-md sm:grid-cols-[200px_1fr]"
            >
              <div
                className="min-h-full  bg-slate-200 bg-cover bg-center"
                style={image ? { backgroundImage: `url('${image}')` } : undefined}
              >
                {!image && (
                  <span className="flex h-full min-h-[132px] items-center justify-center bg-gradient-to-br from-[#28206f] to-[#e11d48] px-2 text-center text-[9px] font-black uppercase tracking-wider text-white">
                    SME TV
                  </span>
                )}
              </div>
              <div className="flex flex-col justify-center p-4">
                <span className="text-[10px]  font-semibold uppercase tracking-widest text-[#d92867]">
                  {mixedMeta(item)}
                </span>
                <h3 className="mt-1.5 line-clamp-2 text-md font-bold uppercase leading-relaxed text-slate-900 group-hover:text-[#28206f]">
                  {item.title}
                </h3>
                {(description || metadata) && (
                  <p className="mt-2 line-clamp-1 text-[10px] font-medium text-slate-500">
                    {description ?? metadata}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
