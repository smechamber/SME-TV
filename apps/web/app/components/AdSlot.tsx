'use client';

import { useEffect, useRef, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export type AdSlotName =
  | 'HOMEPAGE_TOP'
  | 'HOMEPAGE_MIDDLE'
  | 'ARTICLE_TOP'
  | 'ARTICLE_MIDDLE'
  | 'ARTICLE_BOTTOM'
  | 'SIDEBAR'
  | 'FOOTER'
  | 'NEWS_LIST_TOP'
  | 'VIDEO_LIST_TOP';
type ServedAd = {
  placementId: string;
  campaignId: string;
  creativeId: string;
  advertiserId: string;
  companyName: string;
  mediaType: 'IMAGE' | 'VIDEO';
  url: string;
  clickUrl: string;
  altText: string;
  slot: AdSlotName;
};

function sendEvent(payload: Record<string, string>) {
  void fetch(`${API}/api/ads/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

function deviceType() {
  if (typeof window === 'undefined') return 'DESKTOP';
  if (window.innerWidth < 640) return 'MOBILE';
  if (window.innerWidth < 1024) return 'TABLET';
  return 'DESKTOP';
}

export default function AdSlot({
  slot,
  articleId,
  categoryId,
  tags = [],
  className = '',
}: {
  slot: AdSlotName;
  articleId?: string;
  categoryId?: string | null;
  tags?: string[];
  className?: string;
}) {
  const [ad, setAd] = useState<ServedAd | null>(null);
  const [device, setDevice] = useState('DESKTOP');
  const impressionSent = useRef(false);
  const adRef = useRef<HTMLElement | null>(null);
  const tagKey = tags.join(',');

  useEffect(() => {
    const update = () => setDevice(deviceType());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let mounted = true;
    impressionSent.current = false;
    const params = new URLSearchParams({ slot, device });
    if (articleId) params.set('articleId', articleId);
    if (categoryId) params.set('categoryId', categoryId);
    if (tagKey) params.set('tags', tagKey);
    fetch(`${API}/api/ads?${params.toString()}`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = (await response.json()) as { data?: Record<string, ServedAd> };
        return payload.data?.[slot] ?? null;
      })
      .then((result) => { if (mounted) setAd(result); })
      .catch(() => { if (mounted) setAd(null); });
    return () => { mounted = false; };
  }, [slot, articleId, categoryId, tagKey, device]);

  useEffect(() => {
    if (!ad || !adRef.current || impressionSent.current) return;
    const target = adRef.current;
    const track = () => {
      if (impressionSent.current) return;
      impressionSent.current = true;
      sendEvent({ placementId: ad.placementId, eventType: 'IMPRESSION', articleId: articleId ?? '', device });
    };
    if (!('IntersectionObserver' in window)) { track(); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { track(); observer.disconnect(); }
    }, { threshold: 0.5 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [ad, articleId, device]);

  function trackClick() {
    if (!ad) return;
    sendEvent({ placementId: ad.placementId, eventType: 'CLICK', articleId: articleId ?? '', device });
  }

  if (!ad) return null;
  return (
    <aside ref={adRef} aria-label={`Advertisement from ${ad.companyName}`} className={`my-6 overflow-hidden rounded border border-[#eeeaf0] bg-white ${className}`}>
      <div className="flex items-center justify-between px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#8d8795]"><span>Advertisement</span><span>{ad.companyName}</span></div>
      {ad.mediaType === 'VIDEO' ? (
        <div className="p-2"><video className="mx-auto max-h-[360px] w-full" controls playsInline preload="metadata" src={ad.url} /><a className="mt-2 block text-center text-xs font-bold text-[#d92867]" href={ad.clickUrl} target="_blank" rel="sponsored noopener noreferrer" onClick={trackClick}>Learn more</a></div>
      ) : (
        <a className="block" href={ad.clickUrl} target="_blank" rel="sponsored noopener noreferrer" onClick={trackClick}>
          <img className="mx-auto block max-h-[360px] w-full object-contain" src={ad.url} alt={ad.altText} loading="lazy" />
        </a>
      )}
    </aside>
  );
}
