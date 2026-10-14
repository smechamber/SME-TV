'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Story = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  category?: { name?: string };
  publishedAt?: string;
  readTime?: string;
};

type Video = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  views?: string;
};

type EventItem = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  location?: string;
  startsAt: string;
  tag?: string;
};

interface MainContentProps {
  stories: Story[];
  videos: Video[];
  events: EventItem[];
}

export default function MainContent({ stories, videos, events }: MainContentProps) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');

  const filtered = useMemo(
    () =>
      stories.filter((s) => {
        const matchesTopic =
          topic === 'All' || s.category?.name?.toLowerCase().includes(topic.toLowerCase());
        return (
          matchesTopic &&
          `${s.title} ${s.summary ?? ''}`.toLowerCase().includes(query.toLowerCase())
        );
      }),
    [stories, topic, query],
  );

  const topics = [
    'All',
    'Policy & MSME',
    'Business',
    'Finance',
    'Exports',
    'Startups',
    'Technology',
    'Markets',
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero & Top Headlines */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-md group flex flex-col justify-end min-h-[440px] md:min-h-[500px]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('${stories[0]?.imageUrl ?? 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent" />

          <div className="relative p-6 md:p-8 z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 rounded bg-[#e11d48] text-white text-[10px] font-black tracking-widest uppercase">
                {stories[0]?.category?.name ?? 'MSME POLICY'}
              </span>
              {stories[0]?.readTime && (
                <span className="text-slate-300 text-xs font-semibold bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700">
                  {stories[0].readTime}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight group-hover:text-rose-200 transition-colors">
              {stories[0]?.title}
            </h1>

            <p className="text-slate-300 text-sm md:text-base line-clamp-2 leading-relaxed max-w-2xl">
              {stories[0]?.summary}
            </p>

            <div className="pt-3 flex items-center gap-4">
              <Link
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#e11d48] hover:bg-rose-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md"
                href={stories[0]?.slug ? `/news/${stories[0].slug}` : '/news'}
              >
                Read Full Story <span>→</span>
              </Link>
            </div>
          </div>
        </article>

        <aside className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div>
                <small className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] block">TOP HEADLINES</small>
                <h2 className="text-xl font-bold text-[#1e1b4b]">Editor’s Pick</h2>
              </div>
              <Link href="/news" className="text-xs font-bold text-[#1e1b4b] hover:text-[#e11d48] transition-colors">View All →</Link>
            </div>

            <div className="space-y-4">
              {stories.slice(1, 4).map((story, i) => (
                <Link className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-200" href={`/news/${story.slug}`} key={story.id}>
                  <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-[#e11d48] transition-colors">0{i + 1}</span>
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#e11d48] block">{story.category?.name ?? 'SME NEWS'}</span>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#1e1b4b] transition-colors line-clamp-2 leading-snug">{story.title}</h3>
                    <small className="text-[11px] text-slate-400 block font-medium">
                      {story.publishedAt ? new Date(story.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Topics Bar */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" aria-label="Filter news by topic">
        {topics.map((t) => (
          <button
            key={t}
            className={`px-5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all border ${
              topic === t
                ? 'bg-[#1e1b4b] text-white border-transparent shadow-md'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#1e1b4b]'
            }`}
            onClick={() => setTopic(t)}
          >
            {t}
          </button>
        ))}
      </section>

      {/* Latest News Grid with Search */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div>
            <small className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] block">EXECUTIVE COVERAGE</small>
            <h2 className="text-2xl font-bold text-[#1e1b4b]">Latest Business News</h2>
          </div>
          <div className="relative w-full sm:w-72">
            <label htmlFor="story-search" className="sr-only">Search stories</label>
            <input
              id="story-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headlines or topics..."
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 pl-9 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#e11d48] transition-all shadow-sm"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">⌕</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s, i) => (
            <article className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between ${i === 0 ? 'md:col-span-2 lg:col-span-2 md:flex-row' : ''}`} key={s.id}>
              <Link
                href={`/news/${s.slug}`}
                className={`relative bg-cover bg-center block overflow-hidden ${i === 0 ? 'md:w-1/2 min-h-[250px]' : 'h-48'}`}
                style={{ backgroundImage: s.imageUrl ? `url('${s.imageUrl}')` : undefined }}
              >
                <span className="absolute top-3 left-3 bg-[#1e1b4b] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                  {s.category?.name ?? 'SME NEWS'}
                </span>
              </Link>

              <div className={`p-5 flex flex-col justify-between space-y-3 ${i === 0 ? 'md:w-1/2' : 'flex-1'}`}>
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] block">{s.category?.name ?? 'SME NEWS'}</span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1e1b4b] transition-colors leading-snug">
                    <Link href={`/news/${s.slug}`}>{s.title}</Link>
                  </h3>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{s.summary}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold">
                  <span className="text-slate-400 text-[11px]">{s.readTime ?? '3 min read'}</span>
                  <Link className="text-[#1e1b4b] hover:text-[#e11d48] transition-colors uppercase tracking-wider text-[11px] font-bold" href={`/news/${s.slug}`}>
                    Read Article →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Video Band */}
      <section className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div>
            <small className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] block">SME TV BROADCAST</small>
            <h2 className="text-2xl font-bold">Featured Video Interviews</h2>
          </div>
          <Link href="/videos" className="text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-white">Watch All Videos →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((v) => (
            <Link className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-md hover:border-slate-500 transition-all group p-3 space-y-3" href="/videos" key={v.id}>
              <div className="relative aspect-video rounded-lg bg-slate-950 bg-cover bg-center overflow-hidden flex items-center justify-center" style={{ backgroundImage: v.thumbnail ? `url('${v.thumbnail}')` : undefined }}>
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all" />
                <span className="w-10 h-10 rounded-full bg-[#e11d48] text-white flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform z-10 text-xs">▶</span>
                {v.duration && (
                  <span className="absolute bottom-2 right-2 bg-slate-950/90 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {v.duration}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">
                  <span>SME TV SHOW</span>
                  {v.views && <span className="text-slate-400">{v.views}</span>}
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-rose-200 transition-colors line-clamp-2 leading-snug">{v.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div>
            <small className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] block">BUSINESS CALENDAR</small>
            <h2 className="text-2xl font-bold text-[#1e1b4b]">Upcoming Industry Summits</h2>
          </div>
          <Link href="/events" className="text-xs font-bold uppercase tracking-wider text-[#1e1b4b] hover:text-[#e11d48]">Full Calendar →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e) => (
            <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between" key={e.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b] bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    {new Date(e.startsAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {e.tag && (
                    <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider">
                      {e.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{e.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{e.description}</p>
              </div>
              <Link href={`/events/${e.slug}`} className="text-xs font-bold uppercase tracking-wider text-[#1e1b4b] hover:text-[#e11d48] transition-colors">
                Event Details & Registration →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Subscription & Mobile App Banner */}
      <section className="bg-gradient-to-r from-[#1e1b4b] to-[#2e2a72] rounded-2xl p-8 md:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#e11d48] px-3 py-1 rounded">SME TV DIRECT</span>
          <h2 className="text-3xl font-extrabold leading-tight">
            Stay ahead of business policies & market intelligence.
          </h2>
          <p className="text-slate-300 text-sm">
            Get daily headlines, policy breakdowns, and exclusive founder interviews delivered straight to your inbox.
          </p>
          <div className="pt-2 flex items-center gap-3 max-w-md">
            <input
              type="email"
              placeholder="Enter your business email..."
              className="w-full px-4 py-3 rounded-lg text-xs text-slate-900 font-medium focus:outline-none"
            />
            <button className="px-5 py-3 rounded-lg bg-[#e11d48] hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider flex-shrink-0 transition-all">
              Join Free
            </button>
          </div>
        </div>

        <div className="w-44 h-80 bg-slate-950 border-4 border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col justify-between hidden sm:flex">
          <b className="text-[#e11d48] text-xs font-black text-center tracking-wider">SME<span className="text-white">tv</span></b>
          <div className="w-full h-20 bg-slate-900 rounded-xl border border-slate-800" />
          <div className="space-y-1.5">
            <i className="block w-full h-2 bg-slate-800 rounded" />
            <i className="block w-3/4 h-2 bg-slate-800 rounded" />
            <i className="block w-1/2 h-2 bg-[#e11d48] rounded" />
          </div>
          <div className="text-emerald-400 font-bold text-center text-xs">Market Index +1.15%</div>
        </div>
      </section>
    </main>
  );
}