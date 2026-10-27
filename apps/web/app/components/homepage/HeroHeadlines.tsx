'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { HomepageItem, Video } from '../../home-data';
import { isEvent, isStory, isVideo, mixedHref, mixedImage, mixedMeta } from './helpers';
import { VideoPlayer } from './videos';

export default function HeroHeadlines({
  items,
  featuredVideoId,
}: {
  items: HomepageItem[];
  featuredVideoId?: string | null;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const mainVideo =
    featuredVideoId === undefined
      ? items.find(isVideo)
      : items.find((item): item is Video => item.id === featuredVideoId && isVideo(item));
  const latestItems = mainVideo ? items.filter((item) => item !== mainVideo) : items;

  if (!mainVideo && featuredVideoId === undefined) return null;
  if (!mainVideo && !latestItems.length) return null;

  const scrollLatest = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({ top: direction * 190, behavior: 'smooth' });
  };

  return (
    <section
      className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
      aria-label="Hero and latest content"
    >
      <article className="relative min-h-[420px] overflow-hidden rounded-2xl bg-slate-950 shadow-md md:min-h-[500px] lg:col-span-2">
        {mainVideo ? (
          <>
            <VideoPlayer video={mainVideo} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/10" />
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
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#34243f] via-[#1e1b4b] to-slate-950" />
        )}
      </article>

      <aside className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:min-h-[500px] md:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <small className="block text-[10px] font-black uppercase tracking-widest text-[#e11d48]">
              SME TV
            </small>
            <h2 className="text-2xl font-black tracking-tight text-[#1e1b4b]">Latest</h2>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => scrollLatest(-1)}
              className="rounded-full border border-slate-200 px-3 py-2 text-[10px] font-bold text-[#1e1b4b] hover:border-[#d92867] hover:text-[#d92867]"
              aria-label="Previous latest items"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => scrollLatest(1)}
              className="rounded-full border border-slate-200 px-3 py-2 text-[10px] font-bold text-[#1e1b4b] hover:border-[#d92867] hover:text-[#d92867]"
              aria-label="Next latest items"
            >
              Next
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto snap-y snap-mandatory pr-1"
        >
          {latestItems.map((item, index) => {
            const image = mixedImage(item);
            return (
              <Link
                key={`${mixedMeta(item)}-${item.id}`}
                href={mixedHref(item)}
                className="group relative flex min-h-[174px] snap-start items-end overflow-hidden rounded-xl bg-[#1e1b4b]"
              >
                {image && (
                  <img
                    src={image}
                    alt=""
                    loading={index > 1 ? 'lazy' : 'eager'}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                {isVideo(item) && (
                  <span className="absolute right-3 top-3 rounded-full bg-[#e11d48] px-2.5 py-1 text-[9px] font-black uppercase text-white">
                    Play video
                  </span>
                )}
                <span className="relative z-10 p-4">
                  <small className="mb-1 block text-[9px] font-black uppercase tracking-widest text-rose-200">
                    {mixedMeta(item)}
                    {isStory(item) && item.publishedAt
                      ? ` | ${new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                      : isEvent(item)
                        ? ` | ${new Date(item.startsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                        : ''}
                  </small>
                  <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-white md:text-lg">
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
