import Image from 'next/image';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { notFound } from 'next/navigation';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Article = {
  title: string;
  summary: string;
  content: string;
  slug: string;
  publishedAt?: string;
  imageUrl?: string | null;
  category?: { name?: string } | null;
};
async function getArticle(slug: string): Promise<Article | null> {
  try {
    const r = await fetch(`${API}/api/news/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!r.ok) return null;
    const p = (await r.json()) as { data?: Article };
    return p.data ?? null;
  } catch {
    return null;
  }
}
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const item = await getArticle(params.slug);
  if (!item) notFound();
  return (
    <main className="mx-auto w-full max-w-[820px] px-4 py-10 sm:px-6 sm:py-16">
      <Breadcrumbs items={[{ label: 'News', href: '/news' }, { label: item.title }]} />
      <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">{item.category?.name ?? 'SME TV NEWS'}</span>
      <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-.05em] text-[#1b1930] sm:text-5xl">{item.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-[#6e6b7c]">{item.summary}</p>
      <div className="mt-5 border-b border-[#eeeaf0] py-4 text-xs text-[#8d8795]">
        SME TV newsroom
        {item.publishedAt ? ` - ${new Date(item.publishedAt).toLocaleDateString('en-IN')}` : ''}
      </div>
      {item.imageUrl && (
        <Image
          className="my-6 h-auto max-h-[500px] w-full object-cover"
          src={item.imageUrl}
          alt=""
          width={1200}
          height={675}
          unoptimized
        />
      )}
      <div className="my-6 text-[17px] leading-[1.85] text-[#302b36] [&_h2]:mt-8 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-7 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-bold [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_iframe]:my-5 [&_iframe]:aspect-video [&_iframe]:w-full [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-[#eeeaf0] [&_th]:p-2 [&_td]:border [&_td]:border-[#eeeaf0] [&_td]:p-2" dangerouslySetInnerHTML={{ __html: item.content }} />
    </main>
  );
}
