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
  return <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
    <Link className="mb-6 inline-block text-xs font-bold text-[#d92867] hover:underline" href="/">← Home</Link>
    <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">WATCH SME TV</span>
    <h1 className="my-3 text-4xl font-black leading-tight tracking-[-.05em] text-[#1b1930] sm:text-5xl">Videos &amp; interviews</h1>
    <p className="mb-6 max-w-3xl text-sm leading-6 text-[#6e6b7c] sm:text-base">Business stories and conversations from across the SME community.</p>
    {videos.length ? <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
      {videos.map(video => {
        const href = `/videos/${encodeURIComponent(video.slug || video.id)}`;
        const thumbnail = video.thumbnail || (video.videoType === 'YOUTUBE' && /^[\w-]{11}$/.test(video.youtubeId ?? '')
          ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : undefined);
        return <article className="border border-[#eeeaf0] bg-[#fffaf8] p-4" key={video.id}>
          <Link className="relative block aspect-video overflow-hidden bg-[#261d36]" href={href} aria-label={`Open ${video.title}`}>
            {thumbnail ? <img className="h-full w-full object-cover" src={thumbnail} alt="" /> : <div className="grid aspect-video w-full place-items-center bg-[#261d36] text-2xl font-extrabold text-white">SME TV</div>}
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#e11d48] text-white">▶</span>
          </Link>
          <h2 className="mt-4 text-lg font-bold leading-snug text-[#1b1930]"><Link href={href} className="hover:text-[#d92867]">{video.title}</Link></h2>
          {video.description && <div className="my-6 text-[17px] leading-[1.85] text-[#302b36] [&_h2]:mt-8 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-7 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-bold [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_iframe]:my-5 [&_iframe]:aspect-video [&_iframe]:w-full [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-[#eeeaf0] [&_th]:p-2 [&_td]:border [&_td]:border-[#eeeaf0] [&_td]:p-2" dangerouslySetInnerHTML={{ __html: video.description }} />}
        </article>;
      })}
    </div> : <p className="mt-6 flex items-center gap-4 rounded-lg bg-[#fffaf8] p-6 text-sm text-[#6e6b7c]">No videos have been published yet.</p>}
  </main>;
}
