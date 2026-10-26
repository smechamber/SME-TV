import Link from 'next/link';
import type { HomepageItem, HomepageSection } from '../home-data';

function title(item: HomepageItem) { return item.title; }
function image(item: HomepageItem) {
  if ('imageUrl' in item) return item.imageUrl;
  if ('thumbnail' in item) return item.thumbnail;
  return undefined;
}
export default function DynamicHomepage({ sections }: { sections: HomepageSection[] }) {
  return <div className="space-y-12">{sections.map((section) => <section className={`news-section news-design-${section.design.toLowerCase()} ${section.layout === 'HERO' ? 'news-dynamic-hero' : ''} ${section.design === 'DARK_BAND' ? 'news-dynamic-dark' : ''}`} key={section.id}>
    <div className="news-section-heading"><div><small>{section.kind}</small><h2>{section.name}</h2></div></div>
    {section.design === 'SPLIT_FEATURED' ? <SplitFeatured section={section} /> : section.layout === 'HERO' ? <Hero item={section.items[0]} /> : <div className={`${section.layout === 'LIST' || section.design === 'COMPACT_LIST' ? 'grid gap-3' : 'news-card-grid'} ${section.design === 'FEATURED_GRID' ? 'news-dynamic-editorial-grid' : ''}`}>{section.items.map((item) => <Card item={item} contentType={section.contentType} fields={section.displayFields} key={item.id} />)}</div>}
  </section>)}</div>;
}

function SplitFeatured({ section }: { section: HomepageSection }) {
  return <div className="news-split-layout"><div>{section.items[0] ? <Hero item={section.items[0]} /> : <div className="news-empty">Select a lead story for this design.</div>}</div><aside className="news-top-stories"><div className="news-section-heading"><div><small>TOP HEADLINES</small><h2>Editor’s Pick</h2></div><span>View All →</span></div>{section.items.slice(1, 4).map((item, index) => <div className="news-story" key={item.id}><b className="news-story-number">0{index + 1}</b><div><span>{'category' in item ? item.category?.name : section.contentType}</span><h3>{item.title}</h3><small>{'publishedAt' in item && item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}</small></div></div>)}</aside></div>;
}

function Hero({ item }: { item?: HomepageItem }) {
  if (!item) return <div className="news-empty">No published content is selected for this section.</div>;
  const itemImage = image(item);
  return <article className="news-hero" style={itemImage ? { backgroundImage: `linear-gradient(0deg,#211b2ddd,#211b2d22),url("${itemImage}")` } : undefined}><div className="news-hero-copy"><span className="news-live">FEATURED</span><h1>{title(item)}</h1>{'summary' in item && <p>{item.summary}</p>}<Link className="news-primary" href={'slug' in item ? `/news/${item.slug}` : '#'}>Explore story →</Link></div></article>;
}

function Card({ item, contentType, fields }: { item: HomepageItem; contentType: string; fields: string[] }) {
  const itemImage = image(item);
  const itemHref = contentType === 'EVENT' && 'slug' in item ? `/events/${item.slug}` : contentType === 'ARTICLE' && 'slug' in item ? `/news/${item.slug}` : '#';
  const date = 'publishedAt' in item ? item.publishedAt : 'startsAt' in item ? item.startsAt : undefined;
  return <article className="news-card">{fields.includes('IMAGE') && <Link className="news-card-image" href={itemHref} style={itemImage ? { backgroundImage: `url("${itemImage}")` } : undefined}><span>{contentType}</span></Link>}<div><h3>{title(item)}</h3>{fields.includes('CATEGORY') && 'category' in item && item.category?.name && <small>{item.category.name}</small>}{fields.includes('SUMMARY') && 'summary' in item && <p>{item.summary}</p>}{fields.includes('SUMMARY') && 'description' in item && <p>{item.description}</p>}{fields.includes('DATE') && date && <small>{new Date(date).toLocaleDateString('en-IN')}</small>}<Link className="news-read-more" href={itemHref}>View details →</Link></div></article>;
}
