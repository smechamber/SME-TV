'use client';

import { useMemo, useState } from 'react';
import type { HomepageItem, HomepageSection } from '../home-data';
import DynamicHomepage from './DynamicHomepage';
import HeroHeadlines from './homepage/HeroHeadlines';
import EventsSection from './main-content/EventsSection';
import LoadingHomepage from './main-content/LoadingHomepage';
import StoriesSection from './main-content/StoriesSection';
import SubscribeBanner from './main-content/SubscribeBanner';
import TopicsBar from './main-content/TopicsBar';
import VideosSection from './main-content/VideosSection';
import type { EventItem, Story, Video } from './main-content/types';

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
  const filteredStories = useMemo(
    () =>
      stories.filter((item) =>
        matches(`${item.title} ${item.summary ?? ''} ${item.category?.name ?? ''}`),
      ),
    [stories, topic, query],
  );
  const filteredVideos = useMemo(
    () => videos.filter((item) => matches(`${item.title} ${item.description ?? ''}`)),
    [videos, topic, query],
  );
  const filteredEvents = useMemo(
    () =>
      events.filter((item) =>
        matches(`${item.title} ${item.description ?? ''} ${item.location ?? ''} ${item.tag ?? ''}`),
      ),
    [events, topic, query],
  );
  const heroItems: HomepageItem[] = [...videos, ...stories, ...events];

  if (homepageSections?.length) {
    const hasFixedHero = homepageSections.some((section) => section.kind === 'HERO');
    return (
      <main className="news-width news-main">
        {!hasFixedHero && (
          <div className="pt-6">
            <HeroHeadlines items={heroItems} />
          </div>
        )}
        <DynamicHomepage sections={homepageSections} />
      </main>
    );
  }
  if (!stories.length && !videos.length && !events.length) {
    if (!loading && !loadingVideos && !loadingEvents) return null;
    return <LoadingHomepage />;
  }

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      {videos.length > 0 ? (
        <div className="mb-10">
          <HeroHeadlines items={heroItems} />
        </div>
      ) : loadingVideos ? (
        <div
          className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-3"
          aria-label="Loading hero video"
        >
          <div className="min-h-[420px] rounded-2xl bg-slate-200 md:min-h-[500px] lg:col-span-2" />
          <div className="min-h-[420px] rounded-2xl bg-slate-200 md:min-h-[500px]" />
        </div>
      ) : null}
      {(stories.length || videos.length || events.length) > 0 && (
        <TopicsBar topic={topic} onTopicChange={setTopic} />
      )}
      <StoriesSection
        stories={stories}
        filtered={filteredStories}
        query={query}
        onQueryChange={setQuery}
      />
      <VideosSection
        videos={videos}
        filtered={filteredVideos}
        loading={loadingVideos}
        playingVideoId={playingVideoId}
        onPlay={setPlayingVideoId}
      />
      <EventsSection events={events} filtered={filteredEvents} loading={loadingEvents} />
      <SubscribeBanner />
    </main>
  );
}
