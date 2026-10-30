import Link from 'next/link';
import type { Story } from '../../home-data';

export function ArticleHero({ item }: { item?: Story }) {
  if (!item) return null;

  return (
    <article className="relative min-h-[440px] overflow-hidden rounded-2xl bg-white shadow-md group md:min-h-[500px]">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${item.imageUrl ?? ''}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent" />
      <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-end space-y-3 p-6 md:min-h-[500px] md:p-8">
        <div className="flex items-center gap-2">
          <span className="inline-block rounded bg-[#e11d48] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            {item.category?.name ?? 'SME NEWS'}
          </span>
          {item.readTime && (
            <span className="rounded border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-slate-300">
              {item.readTime}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold leading-tight text-white transition-colors group-hover:text-rose-200 md:text-4xl">
          {item.title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
          {item.summary}
        </p>
        <div className="pt-3">
          <Link
            className="inline-flex items-center gap-2 rounded-lg bg-[#e11d48] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-rose-700"
            href={`/news/${item.slug}`}
          >
            Read Full Story <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Headlines({ items }: { items: Story[] }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
            EDITORIAL SPOTLIGHT
          </small>
          <h2 className="text-xl font-bold text-[#1e1b4b]">Featured Stories</h2>
        </div>
        <Link
          href="/news"
          className="text-xs font-bold text-[#1e1b4b] transition-colors hover:text-[#e11d48]"
        >
          View All →
        </Link>
      </div>
      <div className="space-y-4">
        {items.slice(0, 3).map((story, index) => (
          <Link
            className="group flex items-start gap-4 rounded-xl border border-transparent p-3 transition-all hover:border-slate-200 hover:bg-slate-50"
            href={`/news/${story.slug}`}
            key={story.id}
          >
            <span className="font-mono text-2xl font-black text-slate-300 transition-colors group-hover:text-[#e11d48]">
              0{index + 1}
            </span>
            <div className="space-y-1">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#e11d48]">
                {story.category?.name ?? 'SME NEWS'}
              </span>
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-800 transition-colors group-hover:text-[#1e1b4b]">
                {story.title}
              </h3>
              <small className="block text-[11px] font-medium text-slate-400">
                {story.publishedAt
                  ? new Date(story.publishedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : 'Today'}
              </small>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function ArticleCards({ items }: { items: Story[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((story, index) => (
        <article
          className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md ${index === 0 ? 'md:col-span-2 md:flex-row lg:col-span-2' : ''}`}
          key={story.id}
        >
          <Link
            href={`/news/${story.slug}`}
            className={`relative block overflow-hidden bg-cover bg-center ${index === 0 ? 'min-h-[250px] md:w-1/2' : 'h-48'}`}
            style={{ backgroundImage: story.imageUrl ? `url('${story.imageUrl}')` : undefined }}
          >
            <span className="absolute left-3 top-3 rounded bg-[#1e1b4b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              {story.category?.name ?? 'SME NEWS'}
            </span>
          </Link>
          <div
            className={`flex flex-col justify-between space-y-3 p-5 ${index === 0 ? 'md:w-1/2' : 'flex-1'}`}
          >
            <div className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
                {story.category?.name ?? 'SME NEWS'}
              </span>
              <h3 className="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#1e1b4b]">
                <Link href={`/news/${story.slug}`}>{story.title}</Link>
              </h3>
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{story.summary}</p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs font-semibold">
              <span className="text-[11px] text-slate-400">{story.readTime ?? '3 min read'}</span>
              <Link
                className="text-[11px] font-bold uppercase tracking-wider text-[#1e1b4b] transition-colors hover:text-[#e11d48]"
                href={`/news/${story.slug}`}
              >
                Read Article →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
