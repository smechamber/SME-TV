'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import DynamicHomepage from './DynamicHomepage';
import type { HomepageItem, HomepageSection } from '../home-data';
import HeroHeadlines from './homepage/HeroHeadlines';

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
  videoType?: 'UPLOAD' | 'YOUTUBE';
  videoUrl?: string;
  youtubeId?: string;
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
  homepageSections?: HomepageSection[] | null;
  loading?: boolean;
  loadingVideos?: boolean;
  loadingEvents?: boolean;
}

export default function MainContent({
  stories,
  videos,
  events,
  homepageSections,
  loading = false,
  loadingVideos = false,
  loadingEvents = false,
}: MainContentProps) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const matches = (text: string) => {
    const normalized = text.toLowerCase();
    return (
      (topic === 'All' || normalized.includes(topic.toLowerCase())) &&
      normalized.includes(query.trim().toLowerCase())
    );
  };
  const filtered = useMemo(
    () => stories.filter((s) => matches(`${s.title} ${s.summary ?? ''} ${s.category?.name ?? ''}`)),
    [stories, topic, query],
  );
  const filteredVideos = useMemo(
    () => videos.filter((v) => matches(`${v.title} ${v.description ?? ''}`)),
    [videos, topic, query],
  );
  const filteredEvents = useMemo(
    () =>
      events.filter((e) =>
        matches(`${e.title} ${e.description ?? ''} ${e.location ?? ''} ${e.tag ?? ''}`),
      ),
    [events, topic, query],
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

  const heroItems: HomepageItem[] = [...videos, ...stories, ...events];

  if (homepageSections?.length) {
    const hasFixedHero = homepageSections.some((section) => section.kind === 'HERO');
    return (
      <main className="news-width news-main">
        {!hasFixedHero && <div className="pt-6"><HeroHeadlines items={heroItems} /></div>}
        <DynamicHomepage sections={homepageSections} />
      </main>
    );
  }

  if (!stories.length && !videos.length && !events.length) {
    if (!loading && !loadingVideos && !loadingEvents) return null;
    return (
      <main className="max-w-7xl mx-auto px-4 py-8" aria-busy="true" aria-label="Loading homepage">
        <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="min-h-[440px] rounded-2xl bg-slate-200 lg:col-span-2 md:min-h-[500px]" />
          <div className="min-h-[300px] rounded-2xl bg-slate-200" />
        </div>
        <p className="mt-5 text-center text-sm font-medium text-slate-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Fixed video hero and latest carousel */}
      {videos.length > 0 ? (
        <div className="mb-10">
          <HeroHeadlines items={heroItems} />
        </div>
      ) : loadingVideos ? (
        <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-3" aria-label="Loading hero video">
          <div className="min-h-[420px] rounded-2xl bg-slate-200 lg:col-span-2 md:min-h-[500px]" />
          <div className="min-h-[420px] rounded-2xl bg-slate-200 md:min-h-[500px]" />
        </div>
      ) : null}

      {/* Topics Bar */}
      {(stories.length > 0 || videos.length > 0 || events.length > 0) && (
        <section
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          aria-label="Filter news by topic"
        >
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
      )}

      {/* Latest News Grid with Search */}
      {stories.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
            <div>
              <small className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] block">
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
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search headlines or topics..."
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 pl-9 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#e11d48] transition-all shadow-sm"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">⌕</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <article
                className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between ${i === 0 ? 'md:col-span-2 lg:col-span-2 md:flex-row' : ''}`}
                key={s.id}
              >
                <Link
                  href={`/news/${s.slug}`}
                  className={`relative bg-cover bg-center block overflow-hidden ${i === 0 ? 'md:w-1/2 min-h-[250px]' : 'h-48'}`}
                  style={{ backgroundImage: s.imageUrl ? `url('${s.imageUrl}')` : undefined }}
                >
                  <span className="absolute top-3 left-3 bg-[#1e1b4b] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                    {s.category?.name ?? 'SME NEWS'}
                  </span>
                </Link>

                <div
                  className={`p-5 flex flex-col justify-between space-y-3 ${i === 0 ? 'md:w-1/2' : 'flex-1'}`}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] block">
                      {s.category?.name ?? 'SME NEWS'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1e1b4b] transition-colors leading-snug">
                      <Link href={`/news/${s.slug}`}>{s.title}</Link>
                    </h3>
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {s.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold">
                    {s.readTime && <span className="text-slate-400 text-[11px]">{s.readTime}</span>}
                    <Link
                      className="text-[#1e1b4b] hover:text-[#e11d48] transition-colors uppercase tracking-wider text-[11px] font-bold"
                      href={`/news/${s.slug}`}
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Video Band */}
      {(videos.length > 0 || loadingVideos) && (
        <section className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
            <div>
              <small className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] block">
                SME TV ORIGINALS
              </small>
              <h2 className="text-2xl font-bold">Business Talks &amp; Insights</h2>
            </div>
            <Link
              href="/videos"
              className="text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-white"
            >
              Watch All Videos →
            </Link>
          </div>

          {loadingVideos && videos.length === 0 ? (
            <div className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-3" aria-label="Loading videos">
              {[0, 1, 2].map((item) => <div key={item} className="aspect-video rounded-xl bg-slate-700" />)}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredVideos.map((v) => {
              const isPlaying = playingVideoId === v.id;
              const youtubeThumbnail =
                v.youtubeId && /^[\w-]{11}$/.test(v.youtubeId)
                  ? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`
                  : undefined;
              const thumbnail = v.thumbnail ?? youtubeThumbnail;

              return (
                <article
                  className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-md hover:border-slate-500 transition-all group p-3 space-y-3"
                  key={v.id}
                >
                  {isPlaying && v.videoType === 'YOUTUBE' && v.youtubeId ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950">
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : isPlaying && v.videoType === 'UPLOAD' && v.videoUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950">
                      <video
                        className="h-full w-full"
                        controls
                        autoPlay
                        poster={thumbnail}
                        src={v.videoUrl}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="relative aspect-video w-full rounded-lg bg-slate-950 bg-cover bg-center overflow-hidden flex items-center justify-center"
                      style={thumbnail ? { backgroundImage: `url('${thumbnail}')` } : undefined}
                      onClick={() => setPlayingVideoId(v.id)}
                      aria-label={`Play ${v.title}`}
                    >
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all" />
                      <span className="w-10 h-10 rounded-full bg-[#e11d48] text-white flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform z-10 text-xs">
                        ▶
                      </span>
                      {v.duration && (
                        <span className="absolute bottom-2 right-2 bg-slate-950/90 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                          {v.duration}
                        </span>
                      )}
                    </button>
                  )}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">
                      <span>SME TV SHOW</span>
                      {v.views && <span className="text-slate-400">{v.views}</span>}
                    </div>
                    <h3 className="text-xs font-bold text-white group-hover:text-rose-200 transition-colors line-clamp-2 leading-snug">
                      {v.title}
                    </h3>
                  </div>
                </article>
              );
            })}
          </div>
          )}
        </section>
      )}

      {/* Upcoming Events */}
      {(events.length > 0 || loadingEvents) && (
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
            <div>
              <small className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] block">
                SME TV EVENTS
              </small>
              <h2 className="text-2xl font-bold text-[#1e1b4b]">
                Business Events &amp; Opportunities
              </h2>
            </div>
            <Link
              href="/events"
              className="text-xs font-bold uppercase tracking-wider text-[#1e1b4b] hover:text-[#e11d48]"
            >
              Full Calendar →
            </Link>
          </div>

          {loadingEvents && events.length === 0 ? (
            <div className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-3" aria-label="Loading events">
              {[0, 1, 2].map((item) => <div key={item} className="h-40 rounded-2xl bg-slate-200" />)}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredEvents.map((e) => (
              <article
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                key={e.id}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b] bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      {new Date(e.startsAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
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
                <Link
                  href={`/events/${e.slug}`}
                  className="text-xs font-bold uppercase tracking-wider text-[#1e1b4b] hover:text-[#e11d48] transition-colors"
                >
                  Event Details & Registration →
                </Link>
              </article>
            ))}
          </div>
          )}
        </section>
      )}

      {/* Subscription & Mobile App Banner */}
      <section className="bg-gradient-to-r from-[#1e1b4b] to-[#2e2a72] rounded-2xl p-8 md:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#e11d48] px-3 py-1 rounded">
            SME TV DIRECT
          </span>
          <h2 className="text-3xl font-extrabold leading-tight">
            Stay ahead of business policies & market intelligence.
          </h2>
          <p className="text-slate-300 text-sm">
            Get daily headlines, policy breakdowns, and exclusive founder interviews delivered
            straight to your inbox.
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
          <b className="text-[#e11d48] text-xs font-black text-center tracking-wider">
            SME<span className="text-white">tv</span>
          </b>
          <div className="w-full h-20 bg-slate-900 rounded-xl border border-slate-800" />
          <div className="space-y-1.5">
            <i className="block w-full h-2 bg-slate-800 rounded" />
            <i className="block w-3/4 h-2 bg-slate-800 rounded" />
            <i className="block w-1/2 h-2 bg-[#e11d48] rounded" />
          </div>
          <div className="text-emerald-400 font-bold text-center text-xs">SME TV Updates</div>
        </div>
      </section>
    </main>
  );
}
