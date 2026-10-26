'use client';

import Header from './components/Header';
import Tickers from './components/Tickers';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import { useHomeContent } from './useHomeContent';

export default function HomeExperience() {
  const { stories, videos, events, homepageSections } = useHomeContent();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 selection:bg-[#e11d48] selection:text-white">
      <Header />
      <Tickers stories={stories} />
      <MainContent stories={stories} videos={videos} events={events} homepageSections={homepageSections} />
      <Footer />
    </div>
  );
}
