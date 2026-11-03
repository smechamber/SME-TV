import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Video = { id: string; slug: string; title: string; description?: string | null; videoType: 'UPLOAD' | 'YOUTUBE'; youtubeId?: string | null; thumbnail?: string | null };

async function getVideos(): Promise<Video[]> {
  try {
    const response = await fetch(`${API}/api/videos`, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: Video[] };
    return payload.data ?? [];
  } catch { return []; }
}

export default async function VideosPage() {
  const videos = await getVideos();
  return <main className="site-width content-section">
    <Link className="back-link" href="/">← Home</Link>
    <span className="eyebrow">WATCH SME TV</span>
    <h1 className="listing-title">Videos &amp; interviews</h1>
    <p className="listing-intro">Business stories and conversations from across the SME community.</p>
    {videos.length ? <div className="media-grid">
      {videos.map(video => {
        const href = `/videos/${encodeURIComponent(video.slug || video.id)}`;
        const thumbnail = video.thumbnail || (video.videoType === 'YOUTUBE' && /^[\w-]{11}$/.test(video.youtubeId ?? '')
          ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : undefined);
        return <article className="media-card" key={video.id}>
          <Link className="relative block aspect-video overflow-hidden bg-[#261d36]" href={href} aria-label={`Open ${video.title}`}>
            {thumbnail ? <img className="h-full w-full object-cover" src={thumbnail} alt="" /> : <div className="media-placeholder">SME TV</div>}
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#e11d48] text-white">▶</span>
          </Link>
          <h2><Link href={href}>{video.title}</Link></h2>
          {video.description && <div className="article-rich-content" dangerouslySetInnerHTML={{ __html: video.description }} />}
        </article>;
      })}
    </div> : <p className="empty-stories">No videos have been published yet.</p>}
  </main>;
}
