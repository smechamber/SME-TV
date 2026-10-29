'use client';

import { useState } from 'react';
import type { Video } from '../../home-data';
import { youtubeIdForVideo } from './helpers';
import { VideoPlayer } from './videos';

export function HeroVideoPanel({ video }: { video?: Video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const autoPlay = Boolean(video && (youtubeIdForVideo(video) || video.videoUrl));

  return (
    <article className="relative min-h-[420px] overflow-hidden rounded-2xl bg-slate-950 shadow-md md:min-h-[500px] lg:col-span-2">
      {video ? (
        <>
          <VideoPlayer video={video} autoPlay={autoPlay} onPlay={() => setIsPlaying(true)} />
          {!isPlaying && !autoPlay && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
                <span className="mb-2 inline-flex rounded bg-[#e11d48] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                  SME TV VIDEO
                </span>
                <h1 className="max-w-3xl text-2xl font-black leading-tight text-white md:text-4xl">
                  {video.title}
                </h1>
                {video.description && (
                  <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-slate-200">
                    {video.description}
                  </p>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#34243f] via-[#1e1b4b] to-slate-950" />
      )}
    </article>
  );
}
