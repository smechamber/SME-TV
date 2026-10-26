'use client';

import { useEffect, useState } from 'react';
import {
  FALLBACK_EVENTS,
  FALLBACK_STORIES,
  FALLBACK_VIDEOS,
  type EventItem,
  type Story,
  type Video,
  type HomepageSection,
} from './home-data';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function useHomeContent() {
  const [stories, setStories] = useState<Story[]>(FALLBACK_STORIES);
  const [videos, setVideos] = useState<Video[]>(FALLBACK_VIDEOS);
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    const requests = [
      fetch(`${API}/api/homepage`).then((response) =>
        response.ok ? response.json() : Promise.reject(),
      ).catch(() => ({ data: [] })),
      fetch(`${API}/api/news?limit=12`).then((response) =>
        response.ok ? response.json() : Promise.reject(),
      ),
      fetch(`${API}/api/videos`).then((response) =>
        response.ok ? response.json() : Promise.reject(),
      ),
      fetch(`${API}/api/events`).then((response) =>
        response.ok ? response.json() : Promise.reject(),
      ),
    ];

    Promise.all(requests)
      .then(([homepage, news, videoData, eventData]) => {
        if (!isMounted) return;
        if (homepage.data?.length) setHomepageSections(homepage.data);
        if (news.data?.length) setStories(news.data);
        if (videoData.data?.length) setVideos(videoData.data);
        if (eventData.data?.length) setEvents(eventData.data);
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  return { stories, videos, events, homepageSections };
}
