'use client';

import Tickers from './components/Tickers';
import MainContent from './components/MainContent';
import { useHomeContent } from './useHomeContent';

export default function HomeExperience() {
  const { stories, videos, events, homepageSections, loading, loadingVideos, loadingEvents } = useHomeContent();
  return <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 selection:bg-[#e11d48] selection:text-white">
    <Tickers stories={stories} />
    <MainContent stories={stories} videos={videos} events={events} homepageSections={homepageSections} loading={loading} loadingVideos={loadingVideos} loadingEvents={loadingEvents} />
  </div>;
}
