'use client';

import AdSlot from './AdSlot';

const contentClass = 'text-[17px] leading-[1.85] text-[#302b36] [&_h2]:mt-8 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-7 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-bold [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_iframe]:my-5 [&_iframe]:aspect-video [&_iframe]:w-full [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-[#eeeaf0] [&_th]:p-2 [&_td]:border [&_td]:border-[#eeeaf0] [&_td]:p-2';

export default function ArticleContent({
  content,
  articleId,
  categoryId,
  tags,
}: {
  content: string;
  articleId: string;
  categoryId?: string | null;
  tags: string[];
}) {
  const closingParagraphs = [...content.matchAll(/<\/p\s*>/gi)];
  const splitAt = closingParagraphs.length > 1 ? closingParagraphs[Math.floor(closingParagraphs.length / 2)]!.index! + closingParagraphs[Math.floor(closingParagraphs.length / 2)]![0].length : -1;
  const before = splitAt > 0 ? content.slice(0, splitAt) : content;
  const after = splitAt > 0 ? content.slice(splitAt) : '';
  return (
    <>
      <div className={`my-6 ${contentClass}`} dangerouslySetInnerHTML={{ __html: before }} />
      <AdSlot slot="ARTICLE_MIDDLE" articleId={articleId} categoryId={categoryId} tags={tags} />
      {after && <div className={`my-6 ${contentClass}`} dangerouslySetInnerHTML={{ __html: after }} />}
    </>
  );
}
