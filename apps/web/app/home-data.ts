export type Story = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  category?: { name?: string };
  publishedAt?: string;
  readTime?: string;
};

export type Video = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  views?: string;
  videoType?: 'UPLOAD' | 'YOUTUBE';
  videoUrl?: string;
  youtubeId?: string;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  location?: string;
  startsAt: string;
  tag?: string;
};

export type HomepageItem = Story | Video | EventItem;
export type HomepageSection = {
  id: string;
  name: string;
  kind: string;
  layout: 'HERO' | 'GRID' | 'LIST' | 'CAROUSEL';
  design: 'STANDARD' | 'FEATURED_GRID' | 'SPLIT_FEATURED' | 'DARK_BAND' | 'COMPACT_LIST' | 'EVENT_CARDS';
  source: 'MANUAL' | 'LATEST' | 'TRENDING';
  contentType: 'ARTICLE' | 'VIDEO' | 'EVENT' | 'MIXED';
  itemCount: number;
  displayFields: ('IMAGE' | 'CATEGORY' | 'SUMMARY' | 'DATE' | 'META')[];
  items: HomepageItem[];
};

export const FALLBACK_STORIES: Story[] = [
  {
    id: 'f-1',
    slug: 'msme-budget-2025-credit-guarantee-scheme',
    title: 'Government Enhances Credit Guarantee Scheme Limit for MSMEs to ₹10 Crore',
    summary:
      'The Ministry of Micro, Small and Medium Enterprises has expanded collateral-free loan access to boost manufacturing and export competitiveness across tier-2 and tier-3 industrial hubs.',
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    category: { name: 'Policy & MSME' },
    publishedAt: new Date().toISOString(),
    readTime: '3 min read',
  },
  {
    id: 'f-2',
    slug: 'rbi-interest-rate-impact-small-business-loans',
    title: 'RBI Monetary Policy: How Interest Rate Decisions Impact SME Working Capital',
    summary:
      'Financial analysts break down borrowing costs, NBFC liquidity, and floating rate strategies for small businesses facing global supply chain shifts.',
    imageUrl:
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Finance' },
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    readTime: '4 min read',
  },
  {
    id: 'f-3',
    slug: 'export-promotion-digital-trade-hub-india',
    title: 'India’s SME Export Push: New Digital Commerce Hubs Open in Gujarat & Tamil Nadu',
    summary:
      'Special trade corridors aim to onboard over 50,000 local manufacturers onto global cross-border e-commerce platforms with zero duty friction.',
    imageUrl:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Exports' },
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    readTime: '2 min read',
  },
  {
    id: 'f-4',
    slug: 'ai-adoption-in-indian-manufacturing-startups',
    title: 'Industrial AI Adoption: How Indian Startups Are Modernizing Textile & Auto Ancillaries',
    summary:
      'Smart factory sensors and AI inventory forecasting are helping traditional workshops cut wastage by 28% while boosting output.',
    imageUrl:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Technology' },
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    readTime: '5 min read',
  },
  {
    id: 'f-5',
    slug: 'green-business-funding-climate-tech-smes',
    title: 'Green Business Fund: Sustainable Tech Startups Secure ₹450 Crore in Series A Round',
    summary:
      'Renewable energy startups and circular economy enterprises witness record venture inflow amid rising ESG compliance mandates.',
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Startups' },
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    readTime: '3 min read',
  },
];

export const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'v-1',
    title: 'Future of MSME Lending: Keynote Interview with Industry Leaders',
    description: 'Exclusive discussion on digital underwriting and collateral-free credit.',
    thumbnail:
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    duration: '14:20',
    views: '12.4K views',
  },
  {
    id: 'v-2',
    title: 'Scaling from ₹1 Cr to ₹100 Cr: CEO Playbook for Founders',
    description: 'Insights into operations, talent acquisition, and capital allocation.',
    thumbnail:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    duration: '22:15',
    views: '28.1K views',
  },
  {
    id: 'v-3',
    title: 'Global Supply Chain Trends Every Indian Business Must Know',
    description: 'Expert panel on logistics optimization and trade agreements.',
    thumbnail:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    duration: '09:45',
    views: '8.9K views',
  },
];

export const FALLBACK_EVENTS: EventItem[] = [
  {
    id: 'e-1',
    slug: 'national-sme-conclave-delhi',
    title: 'National SME Leadership Conclave 2026',
    description: 'Bharat Mandapam, New Delhi • Keynote by Industry Ministers & Trade Chiefs',
    location: 'New Delhi',
    startsAt: '2026-11-15T09:30:00Z',
    tag: 'Flagship Event',
  },
  {
    id: 'e-2',
    slug: 'startup-funding-expo-mumbai',
    title: 'India Startup & SME Capital Expo',
    description: 'Jio World Convention Centre, Mumbai • 100+ Investors & Angel Networks',
    location: 'Mumbai',
    startsAt: '2026-12-02T10:00:00Z',
    tag: 'Investment',
  },
  {
    id: 'e-3',
    slug: 'export-business-summit-bengaluru',
    title: 'Global Trade & Export Acceleration Summit',
    description: 'KTPO Center, Bengaluru • Cross-border Logistics & Policy Workshop',
    location: 'Bengaluru',
    startsAt: '2026-12-18T10:00:00Z',
    tag: 'Global Trade',
  },
];
