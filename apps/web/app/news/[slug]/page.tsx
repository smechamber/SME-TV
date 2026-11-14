import Image from 'next/image';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { notFound } from 'next/navigation';
import AdSlot from '../../components/AdSlot';
import ArticleContent from '../../components/ArticleContent';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Article = {
  id: string;
  title: string;
  summary: string;
  content: string;
  slug: string;
  publishedAt?: string;
  imageUrl?: string | null;
  category?: { id?: string; name?: string } | null;
  tags?: string[];
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
    <main className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-10 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,820px)_300px]">
      <article>
      <Breadcrumbs items={[{ label: 'News', href: '/news' }, { label: item.title }]} />
      <span className="text-[10px] font-extrabold tracking-[.16em] text-[#d92867]">
        {item.category?.name ?? 'SME TV NEWS'}
      </span>
      <h1 className="mt-3 text-4xl leading-tight tracking-[-.05em] text-[#1b1930] sm:text-5xl">
        {item.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[#6e6b7c]">{item.summary}</p>
      <div className="mt-3 border-b border-[#eeeaf0] py-2 text-xs text-[#8d8795]">
        SME TV newsroom
        {item.publishedAt ? ` - ${new Date(item.publishedAt).toLocaleDateString('en-IN')}` : ''}
      </div>
      <AdSlot slot="ARTICLE_TOP" articleId={item.id} categoryId={item.category?.id} tags={item.tags} />
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
      <ArticleContent content={item.content} articleId={item.id} categoryId={item.category?.id} tags={item.tags ?? []} />
      <AdSlot slot="ARTICLE_BOTTOM" articleId={item.id} categoryId={item.category?.id} tags={item.tags} />
      </article>
      <aside className="block lg:sticky lg:top-6 lg:self-start"><AdSlot slot="SIDEBAR" articleId={item.id} categoryId={item.category?.id} tags={item.tags} /></aside>
    </main>
  );
}
