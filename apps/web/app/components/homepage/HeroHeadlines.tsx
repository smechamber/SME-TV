'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import type { HomepageItem, Video } from '../../home-data';
import { isEvent, isStory, isVideo, mixedHref, mixedImage, mixedMeta, youtubeIdForVideo } from './helpers';
import { VideoPlayer } from './videos';

export default function HeroHeadlines({
  items,
  featuredVideoId,
}: {
  items: HomepageItem[];
  featuredVideoId?: string | null;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMainVideoPlaying, setIsMainVideoPlaying] = useState(false);
  const mainVideo =
    featuredVideoId === undefined
      ? items.find(isVideo)
      : items.find((item): item is Video => item.id === featuredVideoId && isVideo(item));
  const mainVideoAutoPlay = Boolean(mainVideo && (youtubeIdForVideo(mainVideo) || mainVideo.videoUrl));
  const latestItems = mainVideo ? items.filter((item) => item !== mainVideo) : items;

  if (!mainVideo && featuredVideoId === undefined) return null;
  if (!mainVideo && !latestItems.length) return null;

  const scrollLatest = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({
      left: direction * ((carouselRef.current?.clientWidth ?? 320) * 0.88),
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
      aria-label="Hero and latest content"
    >
      <article className="relative min-h-[420px] overflow-hidden rounded-2xl bg-slate-950 shadow-md md:min-h-[500px] lg:col-span-2">
        {mainVideo ? (
          <>
            <VideoPlayer video={mainVideo} autoPlay={mainVideoAutoPlay} onPlay={() => setIsMainVideoPlaying(true)} />
            {!isMainVideoPlaying && !mainVideoAutoPlay && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/10" />
            )}
            {!isMainVideoPlaying && !mainVideoAutoPlay && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
                <span className="mb-2 inline-flex rounded bg-[#e11d48] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                  SME TV VIDEO
                </span>
                <h1 className="max-w-3xl text-2xl font-black leading-tight text-white md:text-4xl">
                  {mainVideo.title}
                </h1>
                {mainVideo.description && (
                  <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-slate-200">
                    {mainVideo.description}
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#34243f] via-[#1e1b4b] to-slate-950" />
        )}
      </article>

      <aside className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:min-h-[500px] ">
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            {/* <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
              SME TV
            </small> */}
            <h2 className="text-2xl font-medium tracking-tight text-[#1e1b4b]">Recent Post</h2>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => scrollLatest(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 shadow-sm hover:border-rose-300 hover:text-[#d92867]"
              aria-label="Previous latest items"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={() => scrollLatest(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 shadow-sm hover:border-rose-300 hover:text-[#d92867]"
              aria-label="Next latest items"
            >
              &#8250;
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="hero-latest-track grid min-h-0 flex-1 auto-cols-[88%] grid-flow-col grid-rows-2 gap-3 overflow-x-auto snap-x snap-mandatory pr-1"
          onWheel={(event) => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
              event.preventDefault();
              event.currentTarget.scrollBy({ left: event.deltaY, behavior: 'auto' });
            }
          }}
        >
          {latestItems.map((item, index) => {
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
                          ? 'https://img.youtube.com/vi/' + youtubeId + '/mqdefault.jpg'
                          : undefined;
                        if (fallback && event.currentTarget.src !== fallback) {
                          event.currentTarget.src = fallback;
                        } else {
                          event.currentTarget.style.display = 'none';
                        }
                      }}
                    />
                  )}
                  {youtubeId ? (
                    <iframe
                      className="absolute inset-0 h-full w-full border-0"
                      src={'https://www.youtube-nocookie.com/embed/' + youtubeId + '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + youtubeId + '&playsinline=1&rel=0'}
                      title={item.title + ' video preview'}
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
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white md:text-base">
                    {item.title}
                  </h3>
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
