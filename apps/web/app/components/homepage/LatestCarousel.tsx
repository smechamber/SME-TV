'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { HomepageItem } from '../../home-data';
import {
  isEvent,
  isStory,
  isVideo,
  mixedHref,
  mixedImage,
  mixedMeta,
  youtubeIdForVideo,
} from './helpers';

export function LatestCarousel({ items }: { items: HomepageItem[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollLatest = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({
      left: direction * ((carouselRef.current?.clientWidth ?? 320) * 0.88),
      behavior: 'auto', // Smooth hata kar instant/normal slide kar diya hai
    });
  };

  return (
    <aside className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:min-h-[500px]">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-medium tracking-tight text-[#1e1b4b]">Recent Post</h2>

     
<div className="flex gap-1">
  {([-1, 1] as const).map((direction) => (
    <button
      key={direction}
      type="button"
      onClick={() => scrollLatest(direction)}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-4xl font-light text-slate-600 shadow-sm hover:border-rose-300 hover:text-[#d92867]"
      aria-label={direction < 0 ? 'Previous latest items' : 'Next latest items'}
    >
      <span className="relative -top-1">
        {direction < 0 ? '\u2039' : '\u203a'}
      </span>
    </button>
  ))}
</div>


      </div>
      <div
        ref={carouselRef}
        className="hero-latest-track grid min-h-0 flex-1 auto-cols-[88%] grid-flow-col grid-rows-2 gap-3 overflow-x-auto snap-x snap-mandatory pr-1"
        onWheel={(event) => {
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            carouselRef.current?.scrollBy({ left: event.deltaY, behavior: 'auto' });
          }
        }}
      >
        {items.map((item, index) => {
          const image = mixedImage(item);
          const youtubeId = isVideo(item) ? youtubeIdForVideo(item) : undefined;
          const directVideoUrl =
            isVideo(item) && item.videoUrl && !youtubeId ? item.videoUrl : undefined;
          return (
            <Link
              key={`${mixedMeta(item)}-${item.id}`}
              href={mixedHref(item)}
              className="group relative flex min-h-[142px] snap-start items-end overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-rose-200 hover:shadow-md"
            >
              <span className="absolute inset-0 bg-slate-950">
                {image && (
                  <img
                    src={image}
                    alt=""
                    loading={index > 1 ? 'lazy' : 'eager'}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => {
                      const fallback = youtubeId
                        ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                        : undefined;
                      if (fallback && event.currentTarget.src !== fallback)
                        event.currentTarget.src = fallback;
                      else event.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                {youtubeId ? (
                  <iframe
                    className="absolute inset-0 h-full w-full border-0"
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0`}
                    title={`${item.title} video preview`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : directVideoUrl ? (
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={directVideoUrl}
                    poster={image}
                    muted
                    playsInline
                    autoPlay
                    loop
                    preload="auto"
                  />
                ) : null}
                {isVideo(item) && (
                  <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#ff0033] text-xs text-white shadow-md">
                    &#9654;
                  </span>
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
              <span className="relative z-10 min-w-0 p-3">
                <small className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-white/80">
                  {mixedMeta(item)}
                  {isStory(item) && item.publishedAt
                    ? ` | ${new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                    : isEvent(item)
                      ? ` | ${new Date(item.startsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                      : ''}
                </small>
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white md:text-[17px]">
                  {item.title}
                </h3>
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
