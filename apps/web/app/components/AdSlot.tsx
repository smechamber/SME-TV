'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export type AdSlotName =
  | 'HOMEPAGE_TOP' | 'HOMEPAGE_MIDDLE' | 'HOMEPAGE_BOTTOM'
  | 'ARTICLE_TOP' | 'ARTICLE_MIDDLE' | 'ARTICLE_BOTTOM' | 'ARTICLE_SIDEBAR'
  | 'VIDEO_TOP' | 'VIDEO_MIDDLE' | 'VIDEO_BOTTOM' | 'VIDEO_SIDEBAR'
  | 'NEWS_LIST_TOP' | 'VIDEO_LIST_TOP' | 'FOOTER';
type ServedAd = { id: string; name: string; imageUrl: string; redirectUrl: string; sidebarPosition: 'LEFT' | 'RIGHT' | 'BOTH' };

export default function AdSlot({
  slot, contentId, contentType, side, className = '',
}: {
  slot: AdSlotName;
  contentId?: string;
  contentType?: 'ARTICLE' | 'VIDEO';
  side?: 'LEFT' | 'RIGHT';
  className?: string;
}) {
  const [ads, setAds] = useState<ServedAd[]>([]);
  const [index, setIndex] = useState(0);
  const isSidebar = slot === 'ARTICLE_SIDEBAR' || slot === 'VIDEO_SIDEBAR';

  useEffect(() => {
    let mounted = true;
    setAds([]);
    setIndex(0);
    const params = new URLSearchParams({ slot });
    if (contentId) params.set('contentId', contentId);
    if (contentType) params.set('contentType', contentType);
    if (side) params.set('side', side);
    fetch(`${API}/api/ads?${params.toString()}`, { cache: 'no-store' })
      .then(async (response) => response.ok ? response.json() as Promise<{ data?: Record<string, ServedAd[]> }> : null)
      .then((payload) => { if (mounted) setAds(payload?.data?.[slot] ?? []); })
      .catch(() => { if (mounted) setAds([]); });
    return () => { mounted = false; };
  }, [slot, contentId, contentType, side]);

  useEffect(() => {
    if (ads.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % ads.length), 6000);
    return () => window.clearInterval(timer);
  }, [ads]);

  const ad = ads[index];
  if (!ad) return null;
  return <aside aria-label={`Advertisement: ${ad.name}`} className={`my-5 min-w-0 ${isSidebar ? 'w-full max-w-[320px]' : 'w-full'} ${className}`}>
    <div className="mb-1 text-center text-[9px] font-bold uppercase tracking-wider text-[#8d8795]">Advertisement</div>
    <a className="block w-full" href={ad.redirectUrl} target="_blank" rel="sponsored noopener noreferrer" aria-label={ad.name}>
      <img className="mx-auto block h-auto max-h-[600px] w-full object-contain" src={ad.imageUrl} alt={ad.name} loading="lazy" />
    </a>
  </aside>;
}
