import Link from 'next/link';
import type { EventItem, HomepageItem, HomepageSection, Video } from '../../home-data';
import {
  isEvent,
  isStory,
  isVideo,
  mixedHref,
  mixedImage,
  mixedMeta,
  videoThumbnail,
} from './helpers';
import { ArticleHero } from './articles';
import { MixedVideoLead, VideoPlayer } from './videos';
import { MixedEventLead } from './events';

export function MixedCard({
  item,
  large = false,
  dark = false,
}: {
  item: HomepageItem;
  large?: boolean;
  dark?: boolean;
}) {
  const description = isStory(item) ? item.summary : item.description;
  return (
    <article
      className={`group overflow-hidden rounded-2xl border ${dark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} shadow-sm transition-shadow hover:shadow-md`}
    >
      <Link href={mixedHref(item)} className="block">
        <div
          className={`${large ? 'h-64' : 'h-40'} bg-slate-100 bg-cover bg-center`}
          style={mixedImage(item) ? { backgroundImage: `url('${mixedImage(item)}')` } : undefined}
        />
        <div className="space-y-2 p-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
            {mixedMeta(item)}
          </span>
          <h3
            className={`text-base font-bold leading-snug ${dark ? 'text-white' : 'text-slate-900'}`}
          >
            {item.title}
          </h3>
          {description && (
            <p
              className={`line-clamp-2 text-xs leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

export function MixedHeadlines({ items }: { items: HomepageItem[] }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
            EDITORIAL SPOTLIGHT
          </small>
          <h2 className="text-xl font-bold text-[#1e1b4b]">Featured Stories</h2>
        </div>
        <Link href="/news" className="text-xs font-bold text-[#1e1b4b] hover:text-[#e11d48]">
          View All →
        </Link>
      </div>
      <div className="space-y-2">
        {items.slice(0, 3).map((item, index) => (
          <Link
            className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-slate-200 hover:bg-slate-50"
            href={mixedHref(item)}
            key={item.id}
          >
            <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-[#e11d48]">
              0{index + 1}
            </span>
            {isVideo(item) && (
              <div
                className="relative mt-1 h-12 w-16 shrink-0 rounded bg-slate-200 bg-cover bg-center"
                style={
                  videoThumbnail(item)
                    ? { backgroundImage: `url('${videoThumbnail(item)}')` }
                    : undefined
                }
              >
                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/30 text-xs text-white">
                  ▶
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#e11d48]">
                  {mixedMeta(item)}
                </span>
                {isVideo(item) && <span className="text-[10px] text-slate-400">▶</span>}
              </div>
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-800">
                {item.title}
              </h3>
              <small className="mt-1 block text-[11px] font-medium text-slate-400">
                {isStory(item) && item.publishedAt
                  ? new Date(item.publishedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : isEvent(item)
                    ? new Date(item.startsAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })
                    : 'Watch now'}
              </small>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function MixedLead({ item }: { item?: HomepageItem }) {
  if (!item) return null;
  if (isStory(item)) return <ArticleHero item={item} />;
  if (isVideo(item)) return <MixedVideoLead item={item} />;
  return <MixedEventLead item={item} />;
}

export function MixedContent({
  items,
  design,
}: {
  items: HomepageItem[];
  design: HomepageSection['design'];
}) {
  if (design === 'SPLIT_FEATURED') {
    const featuredVideo = items.find(isVideo);
    const leadItem = featuredVideo ?? items[0];
    const headlineItems = featuredVideo
      ? items.filter((item) => item.id !== featuredVideo.id)
      : items.slice(1);

    return (
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {featuredVideo ? <MixedVideoLead item={featuredVideo} /> : <MixedLead item={leadItem} />}
        </div>
        <MixedHeadlines items={headlineItems} />
      </section>
    );
  }
  if (design === 'FEATURED_GRID') {
    return (
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <MixedCard item={items[0]} large />
        </div>
        {items.slice(1, 4).map((item) => (
          <MixedCard item={item} key={item.id} />
        ))}
      </section>
    );
  }
  if (design === 'DARK_BAND') {
    return (
      <section className="rounded-2xl bg-slate-900 p-6 md:p-8">
        <div className="mb-5 border-b border-slate-700 pb-4">
          <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
            SME TV ORIGINALS
          </small>
          <h2 className="text-2xl font-bold text-white">Featured Content</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <MixedCard item={item} dark key={item.id} />
          ))}
        </div>
      </section>
    );
  }
  if (design === 'COMPACT_LIST') {
    return (
      <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
        {items.map((item, index) => (
          <Link
            href={mixedHref(item)}
            className="flex items-center gap-4 border-b border-slate-100 p-3 last:border-0 hover:bg-slate-50"
            key={item.id}
          >
            <span className="font-mono text-xl font-black text-[#d92867]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#d92867]">
              {mixedMeta(item)}
            </span>
            <h3 className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">
              {item.title}
            </h3>
          </Link>
        ))}
      </section>
    );
  }
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MixedCard item={item} key={item.id} />
      ))}
    </section>
  );
}
