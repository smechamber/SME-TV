'use client';

import { useEffect, useState } from 'react';
import { type EventItem, type Story, type Video, type HomepageSection } from './home-data';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type ApiResponse<T> = { data?: T[] };

async function fetchItems<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(`${API}${path}`);
    if (!response.ok) return [];
    const payload = (await response.json()) as ApiResponse<T>;
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}

export function useHomeContent() {
  const [stories, setStories] = useState<Story[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      const sections = await fetchItems<HomepageSection>('/api/homepage');
      if (!isMounted) return;
      setHomepageSections(sections);

      const news = await fetchItems<Story>('/api/news?limit=12');
      if (!isMounted) return;
      setStories(news);
      setLoading(false);

      setLoadingVideos(true);
      const videoItems = await fetchItems<Video>('/api/videos');
      if (!isMounted) return;
      setVideos(videoItems);
      setLoadingVideos(false);

      setLoadingEvents(true);
      const eventItems = await fetchItems<EventItem>('/api/events');
      if (!isMounted) return;
      setEvents(eventItems);
      setLoadingEvents(false);
    }

    void loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  return { stories, videos, events, homepageSections, loading, loadingVideos, loadingEvents };
}
