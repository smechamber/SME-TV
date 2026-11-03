import Link from 'next/link';
import { notFound } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Video = {
  title: string;
  slug: string;
  description?: string | null;
  videoType: 'UPLOAD' | 'YOUTUBE';
  videoUrl?: string | null;
  youtubeId?: string | null;
  thumbnail?: string | null;
  publishedAt?: string | null;
};

async function getVideo(slug: string): Promise<Video | null> {
  try {
    const response = await fetch(`${API}/api/videos/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: Video };
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export default async function VideoPage({ params }: { params: { slug: string } }) {
  const video = await getVideo(params.slug);
  if (!video) notFound();
  const youtube = video.videoType === 'YOUTUBE' && /^[\w-]{11}$/.test(video.youtubeId ?? '');

  return (
    <main className="site-width article-page">
      <Link className="back-link" href="/videos">
        &lt;- All videos
      </Link>
      <span className="eyebrow">SME TV VIDEO</span>
      <h1>{video.title}</h1>
      <div className="article-meta">
        SME TV newsroom
        {video.publishedAt ? ` - ${new Date(video.publishedAt).toLocaleDateString('en-IN')}` : ''}
      </div>
      <div className="video-detail-player">
        {youtube ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : video.videoUrl ? (
          <video controls poster={video.thumbnail ?? undefined} src={video.videoUrl} />
        ) : (
          <div className="media-placeholder">SME TV</div>
        )}
      </div>
      {video.description && (
        <div className="article-rich-content" dangerouslySetInnerHTML={{ __html: video.description }} />
      )}
    </main>
  );
}
