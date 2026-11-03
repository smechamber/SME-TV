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
    <main className="mx-auto w-full max-w-[820px] px-4 py-10 sm:px-6 sm:py-16">
      <Link className="mb-6 inline-block text-xs font-bold text-[#d92867] hover:underline" href="/videos">
        &lt;- All videos
      </Link>
      <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">SME TV VIDEO</span>
      <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-.05em] text-[#1b1930] sm:text-5xl">{video.title}</h1>
      <div className="mt-5 border-b border-[#eeeaf0] py-4 text-xs text-[#8d8795]">
        SME TV newsroom
        {video.publishedAt ? ` - ${new Date(video.publishedAt).toLocaleDateString('en-IN')}` : ''}
      </div>
      <div className="my-6 aspect-video overflow-hidden bg-[#0f172a] [&_iframe]:block [&_iframe]:h-full [&_iframe]:w-full [&_video]:block [&_video]:h-full [&_video]:w-full">
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
          <div className="grid aspect-video w-full place-items-center bg-[#261d36] text-2xl font-extrabold text-white">SME TV</div>
        )}
      </div>
      {video.description && (
        <div className="my-6 text-[17px] leading-[1.85] text-[#302b36] [&_h2]:mt-8 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-7 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-bold [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_iframe]:my-5 [&_iframe]:aspect-video [&_iframe]:w-full [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-[#eeeaf0] [&_th]:p-2 [&_td]:border [&_td]:border-[#eeeaf0] [&_td]:p-2" dangerouslySetInnerHTML={{ __html: video.description }} />
      )}
    </main>
  );
}
