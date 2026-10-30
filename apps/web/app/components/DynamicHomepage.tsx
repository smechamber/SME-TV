'use client';

import { useMemo, useState } from 'react';
import type { HomepageSection } from '../home-data';
import HeroHeadlines from './homepage/HeroHeadlines';
import {
  ArticleCards,
  ArticleHero,
  EventCards,
  Headlines,
  isEvent,
  isStory,
  isVideo,
  MixedContent,
  VideoBand,
  VideoHero,
  TrendingSection,
} from './homepage/content';

export default function DynamicHomepage({ sections }: { sections: HomepageSection[] }) {
  const [topic, setTopic] = useState('All');
  const [query, setQuery] = useState('');
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
  const visibleSections = useMemo(
    () =>
      sections.map((section, index) => {
        if (index === 0) return section;
        const normalizedQuery = query.trim().toLowerCase();
        const items = section.items.filter((item) => {
          const category = isStory(item)
            ? (item.category?.name ?? '')
            : isEvent(item)
              ? (item.tag ?? '')
              : '';
          const searchableText = isStory(item)
            ? `${item.title} ${item.summary ?? ''} ${category}`
            : isVideo(item)
              ? `${item.title} ${item.description ?? ''}`
              : `${item.title} ${item.description ?? ''} ${category} ${item.location ?? ''}`;
          const normalizedText = searchableText.toLowerCase();
          const matchesTopic = topic === 'All' || normalizedText.includes(topic.toLowerCase());
          return matchesTopic && normalizedText.includes(normalizedQuery);
        });
        return { ...section, items };
      }),
    [sections, topic, query],
  );

  const filters = (
    <section className="space-y-4" aria-label="Filter homepage content">
      <div className="flex justify-between gap-4 overflow-x-auto pb-4 pt-4 scrollbar-none">
        {topics.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTopic(item)}
            aria-pressed={topic === item}
            className={`shrink-0 rounded-xl border px-6 py-2.5 text-base font-bold uppercase tracking-wider transition-all ${topic === item ? 'border-transparent bg-[#1e1b4b] text-white shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}
          >
            {item}
          </button>
        ))}
      </div>
      {/* <label htmlFor="homepage-search" className="sr-only">
        Search articles, videos, and events
      </label>
      <input
        id="homepage-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search articles, videos, and events..."
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#e11d48] focus:outline-none sm:max-w-md"
      /> */}
    </section>
  );

  return (
    <div>
      {visibleSections.map((section, index) => {
        const stories = section.items.filter(isStory);
        const videos = section.items.filter(isVideo);
        const events = section.items.filter(isEvent);
        if (section.items.length === 0)
          return (
            index === 0 ? (
              <div key={section.id} className="pt-12">
                {filters}
              </div>
            ) : null
          );
        if (section.kind === 'HERO')
          return (
            <div key={section.id} className="space-y-8 pt-6">
              <HeroHeadlines items={section.items} featuredVideoId={section.heroVideoId} />
              {index === 0 && filters}
            </div>
          );
        if (section.kind === 'TRENDING')
          return (
            <section key={section.id} className={index === 1 ? 'pt-6' : 'pt-12'}>
              <TrendingSection items={section.items} />
            </section>
          );
        if (section.contentType === 'MIXED')
          return (
            <div key={section.id} className={`space-y-10 ${index === 1 ? 'pt-6' : 'pt-12'}`}>
              <div>
                {/* <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
                  {section.kind}
                </small> */}
                {/* <h2 className="text-2xl font-bold text-[#1e1b4b]">{section.name}</h2> */}
              </div>
              <MixedContent items={section.items} design={section.design} />
              {index === 0 && filters}
            </div>
          );
        if (
          section.contentType === 'VIDEO' &&
          (section.layout === 'HERO' || section.design === 'SPLIT_FEATURED')
        ) {
          return (
            <div key={section.id} className={`space-y-10 ${index === 1 ? 'pt-6' : 'pt-12'}`}>
              <VideoHero items={videos} />
              {index === 0 && filters}
            </div>
          );
        }
        if (section.contentType === 'VIDEO')
          return (
            <div key={section.id} className={`space-y-10 ${index === 1 ? 'pt-6' : 'pt-12'}`}>
              <VideoBand items={videos} />
              {index === 0 && filters}
            </div>
          );
        if (section.contentType === 'EVENT')
          return (
            <div key={section.id} className={`space-y-10 ${index === 1 ? 'pt-6' : 'pt-12'}`}>
              <EventCards items={events} />
              {index === 0 && filters}
            </div>
          );
        if (section.layout === 'HERO' || section.design === 'SPLIT_FEATURED' || index === 0)
          return (
            <div key={section.id} className={`space-y-10 ${index === 1 ? 'pt-6' : 'pt-12'}`}>
              <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ArticleHero item={stories[0]} />
                </div>
                <Headlines items={stories.slice(1)} />
              </section>
              {index === 0 && filters}
            </div>
          );
        return (
          <section key={section.id} className={index === 1 ? 'pt-6' : 'pt-12'}>
            <ArticleCards items={stories} />
          </section>
        );
      })}
    </div>
  );
}