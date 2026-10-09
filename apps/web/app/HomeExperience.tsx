'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Story = { id: string; slug: string; title: string; summary?: string; imageUrl?: string; category?: { name?: string }; publishedAt?: string };
type Video = { id: string; title: string; description?: string; thumbnail?: string; videoUrl?: string; youtubeId?: string; videoType?: string };
type EventItem = { id: string; slug: string; title: string; description?: string; location?: string; startsAt: string };

export default function HomeExperience() {
  const [stories, setStories] = useState<Story[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`${apiUrl}/api/news?limit=12`).then(r => r.ok ? r.json() : Promise.reject()),
      fetch(`${apiUrl}/api/videos`).then(r => r.ok ? r.json() : Promise.reject()),
      fetch(`${apiUrl}/api/events`).then(r => r.ok ? r.json() : Promise.reject()),
    ]).then(([news, videoData, eventData]) => {
      if (!active) return;
      setStories(news.data ?? []); setVideos(videoData.data ?? []); setEvents(eventData.data ?? []);
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => stories.filter(s => {
    const matchesTopic = topic === 'All' || s.category?.name?.toLowerCase().includes(topic.toLowerCase());
    return matchesTopic && `${s.title} ${s.summary ?? ''}`.toLowerCase().includes(query.toLowerCase());
  }), [stories, topic, query]);
  const topics = ['All', 'MSME', 'Business', 'Finance', 'Exports', 'Startups', 'Technology', 'Markets'];

  return <div className="news-home">
    <div className="news-topline"><div className="news-width"><span><i className="live-dot"/> SME BUSINESS NETWORK</span><span className="news-date">SME TV · India</span><span className="news-topics">MSME &nbsp;•&nbsp; BUSINESS &nbsp;•&nbsp; FINANCE &nbsp;•&nbsp; EXPORTS &nbsp;•&nbsp; STARTUPS</span></div></div>
    <header className="news-header news-width">
      <button className="news-menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">☰</button>
      <div className="news-social"><a href="https://www.facebook.com/SMEtvIndia/" aria-label="Facebook">f</a><a href="https://www.youtube.com/@smetvindia" aria-label="YouTube">▶</a><a href="https://www.linkedin.com/company/sme-tv/" aria-label="LinkedIn">in</a></div>
      <Link href="/" className="news-logo" aria-label="SME TV home"><Image src="https://smetv.in/wp-content/uploads/2024/12/smetv-2048x956.png" alt="SMEtv Digital Voice of SMEs" width={180} height={84} unoptimized /></Link>
      <div className="news-actions"><button className="news-search-button" aria-label="Focus search" onClick={() => document.getElementById('story-search')?.focus()}>⌕</button><Link href="/register" className="news-subscribe">Subscribe</Link></div>
    </header>
    <nav className={`news-nav ${menuOpen ? 'is-open' : ''}`}><div className="news-width">{[['Home','/'],['News','/news'],['Markets','#market'],['Videos','/videos'],['Events','/events'],['Business','/news'],['Finance','/news'],['Startups','/news'],['About','/about'],['Contact','/about']].map(([label, href], i) => <Link key={label} className={i === 0 ? 'selected' : ''} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</div></nav>
    <div className="news-market"><div className="news-width"><b>MARKET WATCH</b><span>Market data is currently unavailable</span><Link href="/news">Read business news →</Link></div></div>
    <div className="news-breaking"><b>BREAKING NEWS</b><div>{stories.slice(0, 4).map((s, i) => <Link href={`/news/${s.slug}`} key={s.id}>{i > 0 && <span className="breaking-separator">•</span>}{s.title}</Link>)}{!stories.length && <span>Business stories and opportunities shaping India’s SME community</span>}</div></div>
    <main className="news-width news-main">
      <section className="news-hero-layout">
        <article className="news-hero" style={{ backgroundImage: `linear-gradient(0deg,rgba(17,14,26,.9),rgba(17,14,26,.04) 74%),url('${stories[0]?.imageUrl ?? 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85'}')` }}>
          <div className="news-hero-copy"><span className="news-live"><i/> LATEST NEWS</span><span className="news-kicker">{stories[0]?.category?.name ?? 'MSME · BUSINESS'}</span><h1>{stories[0]?.title ?? 'India’s SME economy: stories, ideas and opportunities'}</h1><p>{stories[0]?.summary ?? 'Latest developments, policy updates and business opportunities for India’s entrepreneurs.'}</p><Link className="news-primary" href={stories[0]?.slug ? `/news/${stories[0].slug}` : '/news'}>Read story <span>→</span></Link></div>
          <div className="news-hero-controls"><span>01 / {String(Math.max(stories.length, 1)).padStart(2, '0')}</span><Link href="/news">Explore all news →</Link></div>
        </article>
        <aside className="news-top-stories"><div className="news-section-heading"><div><small>WHAT’S HAPPENING</small><h2>Top Stories</h2></div><Link href="/news">View all →</Link></div>
          {stories.slice(1, 4).map((story, i) => <Link className="news-story" href={`/news/${story.slug}`} key={story.id}><span className="news-story-number">0{i + 1}</span><div><span>{story.category?.name ?? 'SME NEWS'}</span><h3>{story.title}</h3><small>{story.publishedAt ? new Date(story.publishedAt).toLocaleDateString('en-IN') : 'Latest'}</small></div></Link>)}
          {!stories.length && <p className="news-empty">{error ? 'News is temporarily unavailable. Please refresh.' : 'Published stories will appear here.'}</p>}
        </aside>
      </section>
      <section className="news-topics-bar" aria-label="Filter news by topic">{topics.map(t => <button key={t} className={topic === t ? 'active' : ''} onClick={() => setTopic(t)}>{t}</button>)}</section>
      <section className="news-section" id="market"><div className="news-section-heading"><div><small>BUSINESS PULSE</small><h2>Market <em>Watch</em></h2></div><span className="market-note">Live quotes are not connected</span></div><div className="market-placeholder"><span className="market-icon">↗</span><div><b>Market data will appear here</b><p>Connect a market data provider to show live index values.</p></div><Link href="/news">Latest business coverage →</Link></div></section>
      <section className="news-section"><div className="news-section-heading"><div><small>JUST IN</small><h2>Latest <em>News</em></h2></div><Link href="/news">See all →</Link></div>
        <div className="news-search-wrap"><label htmlFor="story-search">Search stories</label><input id="story-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by headline or topic" /></div>
        {filtered.length ? <div className="news-card-grid">{filtered.slice(0, 6).map((s, i) => <article className={`news-card ${i === 0 ? 'featured' : ''}`} key={s.id}><Link href={`/news/${s.slug}`} className="news-card-image" style={{ backgroundImage: s.imageUrl ? `url('${s.imageUrl}')` : undefined }}><span>{s.category?.name ?? 'SME NEWS'}</span></Link><div><small>{s.category?.name ?? 'SME NEWS'}</small><h3><Link href={`/news/${s.slug}`}>{s.title}</Link></h3><p>{s.summary}</p><Link className="news-read-more" href={`/news/${s.slug}`}>Read full story →</Link></div></article>)}</div> : <div className="news-empty">{error ? 'Could not reach the SME TV API. Check your connection and refresh.' : 'No published stories match this filter yet.'}</div>}
      </section>
      <section className="news-video-band"><div className="news-section-heading"><div><small>WATCH NOW</small><h2>SME TV <em>Videos</em></h2></div><Link href="/videos">More videos →</Link></div><div className="news-video-grid">{videos.slice(0, 3).map(v => <Link className="news-video-card" href="/videos" key={v.id}><div style={{ backgroundImage: v.thumbnail ? `url('${v.thumbnail}')` : undefined }}><span>▶</span></div><small>SME TV</small><h3>{v.title}</h3></Link>)}{!videos.length && <p className="news-empty">Videos published by SME TV will appear here.</p>}</div></section>
      <section className="news-section"><div className="news-section-heading"><div><small>SME ECOSYSTEM</small><h2>Upcoming <em>Events</em></h2></div><Link href="/events">Calendar →</Link></div><div className="news-event-grid">{events.slice(0, 3).map(e => <article className="news-event" key={e.id}><small>{new Date(e.startsAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }).toUpperCase()}</small><h3>{e.title}</h3><p>{e.location ?? e.description ?? 'Event details'}</p><Link href={`/events/${e.slug}`}>Event details →</Link></article>)}{!events.length && <p className="news-empty">Upcoming events will appear here when published.</p>}</div></section>
      <section className="news-app-promo"><div><small>SME TV EVERYWHERE</small><h2>Business news.<br/><em>Always with you.</em></h2><p>Read stories, watch interviews and find SME events on the go.</p><Link className="news-primary" href="/register">Create your account →</Link></div><div className="news-phone" aria-label="SME TV mobile experience"><b>SME<span>tv</span></b><div className="phone-photo"/><i/><i/><i className="short"/><div className="phone-chart">↗</div></div></section>
    </main>
    <footer className="news-footer"><div className="news-width"><Link href="/" className="news-logo"><Image src="https://smetv.in/wp-content/uploads/2024/12/smetv-2048x956.png" alt="SMEtv" width={150} height={70} unoptimized/></Link><p>Digital voice of India’s SMEs, entrepreneurs and business ecosystem.</p><div className="news-footer-links"><Link href="/about">About</Link><Link href="/news">News</Link><Link href="/events">Events</Link><Link href="/videos">Videos</Link><Link href="/about">Contact</Link><Link href="/login">Sign in</Link></div><small>© {new Date().getFullYear()} SME TV. All rights reserved.</small></div></footer>
    <nav className="news-mobile-nav"><Link className="active" href="/">⌂<small>Home</small></Link><Link href="/news">▤<small>News</small></Link><Link className="watch" href="/videos">▶<small>Watch</small></Link><Link href="#market">⌁<small>Markets</small></Link><button onClick={() => setMenuOpen(v => !v)}>☰<small>More</small></button></nav>
  </div>;
}
