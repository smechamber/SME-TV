import Link from 'next/link';
import { useState } from 'react';
import type { Video } from '../../home-data';
import { videoThumbnail, youtubeIdForVideo } from './helpers';

export function VideoPlayer({ video }: { video: Video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnail = videoThumbnail(video);
  const youtubeId = youtubeIdForVideo(video);
  const isYoutubeVideo = video.videoType === 'YOUTUBE' || Boolean(youtubeId);
  const canPlay = isYoutubeVideo ? Boolean(youtubeId) : Boolean(video.videoUrl);

  if (isPlaying && isYoutubeVideo && youtubeId) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  if (isPlaying && !isYoutubeVideo && video.videoUrl) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        controls
        poster={thumbnail}
        src={video.videoUrl}
      />
    );
  }

  return (
    <button
      type="button"
      className="group absolute inset-0 h-full w-full overflow-hidden bg-gradient-to-br from-[#34243f] via-[#1e1b4b] to-slate-950"
      onClick={() => canPlay && setIsPlaying(true)}
      disabled={!canPlay}
      aria-label={canPlay ? `Play ${video.title}` : video.title}
    >
      {thumbnail ? (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={thumbnail}
          alt={`${video.title} video preview`}
          onError={(event) => {
            event.currentTarget.style.opacity = '0';
          }}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold uppercase tracking-[0.2em] text-white/80">
          {isYoutubeVideo ? 'YouTube video' : 'Video preview'}
        </span>
      )}
      <span className="absolute inset-0 bg-slate-950/30 transition-colors group-hover:bg-slate-950/15" />
      {canPlay && (
        <span className="absolute left-1/2 top-1/2 z-10 flex h-14 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-[#ff0033] text-2xl text-white shadow-lg transition-transform hover:scale-105">
          ▶
        </span>
      )}
      {isYoutubeVideo && (
        <span className="absolute bottom-4 left-4 rounded bg-black/75 px-3 py-1.5 text-xs font-bold text-white">
          YouTube
        </span>
      )}
    </button>
  );
}

export function VideoHero({ items }: { items: Video[] }) {
  const [featured, ...sideVideos] = items;
  if (!featured) return null;

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-slate-950 shadow-md md:min-h-[500px] lg:col-span-2">
        <VideoPlayer video={featured} />
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 border-b border-slate-200 pb-4">
          <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
            VIDEO SPOTLIGHT
          </small>
          <h2 className="text-xl font-bold text-[#1e1b4b]">Business Talks &amp; Insights</h2>
        </div>
        <div className="space-y-4">
          {sideVideos.slice(0, 3).map((video) => (
            <Link
              href="/videos"
              className="group block rounded-xl border border-transparent p-3 transition-all hover:border-slate-200 hover:bg-slate-50"
              key={video.id}
            >
              <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-[#e11d48]">
                SME TV ORIGINAL
              </span>
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-800 transition-colors group-hover:text-[#1e1b4b]">
                {video.title}
              </h3>
              {video.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {video.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </aside>
    </section>
  );
}

export function VideoBand({ items }: { items: Video[] }) {
  return (
    <section className="space-y-6 rounded-2xl bg-slate-900 p-6 text-white md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((video) => (
          <article
            className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/80 p-3 shadow-md transition-all hover:border-slate-500"
            key={video.id}
          >
            <div
              className="relative aspect-video overflow-hidden rounded-lg bg-slate-950 bg-cover bg-center"
              style={
                videoThumbnail(video)
                  ? { backgroundImage: `url('${videoThumbnail(video)}')` }
                  : undefined
              }
            >
              <div className="absolute inset-0 bg-slate-950/40" />
              <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e11d48] text-xs font-bold text-white">
                ▶
              </span>
              {video.duration && (
                <span className="absolute bottom-2 right-2 rounded bg-slate-950/90 px-2 py-0.5 font-mono text-[10px] text-white">
                  {video.duration}
                </span>
              )}
            </div>
            <div className="pt-3">
              <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-rose-400">
                <span>SME TV SHOW</span>
                {video.views && <span className="text-slate-400">{video.views}</span>}
              </div>
              <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white">
                {video.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MixedVideoLead({ item }: { item: Video }) {
  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-slate-950 shadow-md md:min-h-[500px]">
      <VideoPlayer video={item} />
    </div>
  );
}
