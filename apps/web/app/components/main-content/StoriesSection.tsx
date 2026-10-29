import Link from 'next/link';
import type { Story } from './types';

export default function StoriesSection({
  stories,
  filtered,
  query,
  onQueryChange,
}: {
  stories: Story[];
  filtered: Story[];
  query: string;
  onQueryChange: (query: string) => void;
}) {
  if (!stories.length) return null;
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
            SME TV COVERAGE
          </small>
          <h2 className="text-2xl font-bold text-[#1e1b4b]">Business Stories &amp; Insights</h2>
        </div>
        <div className="relative w-full sm:w-72">
          <label htmlFor="story-search" className="sr-only">
            Search stories
          </label>
          <input
            id="story-search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search headlines or topics..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pl-9 text-xs font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-[#e11d48] focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-xs text-slate-400">⌕</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((story, index) => (
          <article
            key={story.id}
            className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md ${index === 0 ? 'md:col-span-2 md:flex-row lg:col-span-2' : ''}`}
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
                <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                  {story.summary}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs font-semibold">
                {story.readTime && (
                  <span className="text-[11px] text-slate-400">{story.readTime}</span>
                )}
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
    </section>
  );
}
