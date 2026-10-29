import Link from 'next/link';
import type { Video } from './types';

export default function VideosSection({
  videos,
  filtered,
  loading,
  playingVideoId,
  onPlay,
}: {
  videos: Video[];
  filtered: Video[];
  loading: boolean;
  playingVideoId: string | null;
  onPlay: (id: string) => void;
}) {
  if (!videos.length && !loading) return null;
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
      {loading && !videos.length ? (
        <div
          className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-3"
          aria-label="Loading videos"
        >
          {[0, 1, 2].map((item) => (
            <div key={item} className="aspect-video rounded-xl bg-slate-700" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {filtered.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isPlaying={playingVideoId === video.id}
              onPlay={() => onPlay(video.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function VideoCard({
  video,
  isPlaying,
  onPlay,
}: {
  video: Video;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const youtubeThumbnail =
    video.youtubeId && /^[\w-]{11}$/.test(video.youtubeId)
      ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
      : undefined;
  const thumbnail = video.thumbnail ?? youtubeThumbnail;
  return (
    <article className="group space-y-3 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/80 p-3 shadow-md transition-all hover:border-slate-500">
      {isPlaying && video.videoType === 'YOUTUBE' && video.youtubeId ? (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-950">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : isPlaying && video.videoType === 'UPLOAD' && video.videoUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-950">
          <video
            className="h-full w-full"
            controls
            autoPlay
            poster={thumbnail}
            src={video.videoUrl}
          />
        </div>
      ) : (
        <button
          type="button"
          className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-slate-950 bg-cover bg-center"
          style={thumbnail ? { backgroundImage: `url('${thumbnail}')` } : undefined}
          onClick={onPlay}
          aria-label={`Play ${video.title}`}
        >
          <div className="absolute inset-0 bg-slate-950/40 transition-all group-hover:bg-slate-950/20" />
          <span className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#e11d48] text-xs font-bold text-white shadow-lg transition-transform group-hover:scale-110">
            ▶
          </span>
          {video.duration && (
            <span className="absolute bottom-2 right-2 rounded bg-slate-950/90 px-2 py-0.5 font-mono text-[10px] text-white">
              {video.duration}
            </span>
          )}
        </button>
      )}
      <div>
        <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-rose-400">
          <span>SME TV SHOW</span>
          {video.views && <span className="text-slate-400">{video.views}</span>}
        </div>
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white transition-colors group-hover:text-rose-200">
          {video.title}
        </h3>
      </div>
    </article>
  );
}
