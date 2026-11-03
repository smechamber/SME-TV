'use client';

import Link from 'next/link';
import type { Video } from './types';

export default function VideosSection({ videos, filtered, loading }: {
  videos: Video[]; filtered: Video[]; loading: boolean;
}) {
  if (!videos.length && !loading) return null;
  return <section className="space-y-6 rounded-2xl bg-slate-900 p-6 text-white md:p-8">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div><small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">SME TV ORIGINALS</small><h2 className="text-2xl font-bold">Business Talks &amp; Insights</h2></div>
      <Link href="/videos" className="text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-white">Watch All Videos →</Link>
    </div>
    {loading && !videos.length ? <div className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-3" aria-label="Loading videos">
      {[0, 1, 2].map(item => <div key={item} className="aspect-video rounded-xl bg-slate-700" />)}
    </div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{filtered.map(video => <VideoCard key={video.id} video={video} />)}</div>}
  </section>;
}

function VideoCard({ video }: { video: Video }) {
  const href = `/videos/${encodeURIComponent(video.slug || video.id)}`;
  const youtubeThumbnail = video.youtubeId && /^[\w-]{11}$/.test(video.youtubeId)
    ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : undefined;
  const thumbnail = video.thumbnail ?? youtubeThumbnail;
  return <article className="group space-y-3 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/80 p-3 shadow-md transition-all hover:border-slate-500">
    <Link href={href} className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-slate-950 bg-cover bg-center" style={thumbnail ? { backgroundImage: `url('${thumbnail}')` } : undefined} aria-label={`Open ${video.title}`}>
      <span className="absolute inset-0 bg-slate-950/40 transition-colors group-hover:bg-slate-950/20" />
      <span className="z-10 grid h-10 w-10 place-items-center rounded-full bg-[#e11d48] text-xs font-bold text-white shadow-lg">▶</span>
    </Link>
    <Link href={href} className="block">
      <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-rose-400"><span>SME TV SHOW</span>{video.views && <span className="text-slate-400">{video.views}</span>}</div>
      <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white transition-colors group-hover:text-rose-200">{video.title}</h3>
    </Link>
  </article>;
}
