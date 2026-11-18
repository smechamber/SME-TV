'use client';

import { FormEvent, useEffect, useState } from 'react';
import MediaUpload from '../MediaUpload';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const locationGroups = [
  {
    title: 'Homepage',
    options: [
      ['HOMEPAGE_TOP', 'Homepage Top'],
      ['HOMEPAGE_MIDDLE', 'Homepage Middle'],
      ['HOMEPAGE_BOTTOM', 'Homepage Bottom'],
    ],
  },
  {
    title: 'Articles',
    options: [
      ['ARTICLE_TOP', 'Article Top'],
      ['ARTICLE_MIDDLE', 'Article Middle'],
      ['ARTICLE_BOTTOM', 'Article Bottom'],
      ['ARTICLE_SIDEBAR', 'Article Sidebar'],
    ],
  },
  {
    title: 'Videos',
    options: [
      ['VIDEO_TOP', 'Video Top'],
      ['VIDEO_MIDDLE', 'Video Middle'],
      ['VIDEO_BOTTOM', 'Video Bottom'],
      ['VIDEO_SIDEBAR', 'Video Sidebar'],
    ],
  },
  {
    title: 'News Page Sidebar',
    options: [
      ['NEWS_LIST_TOP', 'News Listing Top'],
      ['NEWS_SEARCH_TOP', 'Above Search'],
      ['NEWS_SEARCH_BOTTOM', 'Below Search'],
      ['NEWS_EVENTS_TOP', 'Above Upcoming Events'],
      ['NEWS_EVENTS_BOTTOM', 'Below Upcoming Events'],
      ['NEWS_ARCHIVES_TOP', 'Above Archives'],
      ['NEWS_ARCHIVES_BOTTOM', 'Below Archives'],
    ],
  },
  {
    title: 'Videos Page Sidebar',
    options: [
      ['VIDEO_LIST_TOP', 'Videos Listing Top'],
      ['VIDEOS_SEARCH_TOP', 'Above Search'],
      ['VIDEOS_SEARCH_BOTTOM', 'Below Search'],
      ['VIDEOS_EVENTS_TOP', 'Above Upcoming Events'],
      ['VIDEOS_EVENTS_BOTTOM', 'Below Upcoming Events'],
      ['VIDEOS_ARCHIVES_TOP', 'Above Archives'],
      ['VIDEOS_ARCHIVES_BOTTOM', 'Below Archives'],
    ],
  },
  { title: 'Other', options: [['FOOTER', 'Footer']] },
] as const;
type Location = (typeof locationGroups)[number]['options'][number][0];
const locationLabels = locationGroups.reduce(
  (labels, group) => {
    for (const [value, label] of group.options) labels[value] = label;
    return labels;
  },
  {} as Record<Location, string>,
);
type Target = { id: string; title: string; publishedAt: string | null };
type TargetMode = 'ALL' | 'SELECTED';
type Advertisement = {
  id: string;
  name: string;
  imageUrl: string;
  redirectUrl: string;
  enabled: boolean;
  locations: Location[];
  articleTargetMode: TargetMode;
  videoTargetMode: TargetMode;
  sidebarPosition: 'LEFT' | 'RIGHT' | 'BOTH';
  articles: Array<{ article: Target }>;
  videos: Array<{ video: Target }>;
};

const inputClass =
  'w-full rounded border border-[#dedbe3] bg-white px-3 py-2.5 text-xs font-normal text-[#282338]';
const buttonClass =
  'rounded bg-[#d92867] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#b81d53] disabled:opacity-50';
const secondaryButton =
  'rounded border border-[#dedbe3] bg-white px-3 py-2 text-[11px] font-bold text-[#504b5b]';

function monthKey(target: Target) {
  return target.publishedAt ? target.publishedAt.slice(0, 7) : 'undated';
}
function monthLabel(key: string) {
  if (key === 'undated') return 'Date unavailable';
  const [year, month] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function TargetPicker({
  label,
  targets,
  selected,
  onChange,
}: {
  label: string;
  targets: Target[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});
  const normalized = search.trim().toLowerCase();
  const filtered = targets.filter((target) => target.title.toLowerCase().includes(normalized));
  const groups = new Map<string, Target[]>();
  for (const target of filtered) {
    const key = monthKey(target);
    groups.set(key, [...(groups.get(key) ?? []), target]);
  }
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  const toggleMonth = (items: Target[]) => {
    const ids = new Set(items.map((item) => item.id));
    const allSelected = items.every((item) => selected.includes(item.id));
    onChange(
      allSelected ? selected.filter((id) => !ids.has(id)) : [...new Set([...selected, ...ids])],
    );
  };
  return (
    <fieldset className="grid gap-2 rounded border border-[#ebe8ef] p-3">
      <legend className="px-1 text-xs font-bold">{label}</legend>
      <input
        className={inputClass}
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={`Search ${label.toLowerCase()}...`}
      />
      <div className="max-h-80 overflow-auto divide-y divide-[#ebe8ef]">
        {[...groups.entries()]
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([month, items]) => {
            const isOpen = openMonths[month] ?? true;
            const allSelected = items.every((item) => selected.includes(item.id));
            return (
              <section key={month}>
                <div className="flex items-center justify-between gap-2 py-2">
                  <button
                    type="button"
                    className="text-left text-[11px] font-bold"
                    aria-expanded={isOpen}
                    onClick={() => setOpenMonths((current) => ({ ...current, [month]: !isOpen }))}
                  >
                    {isOpen ? '▾' : '▸'} {monthLabel(month)} ({items.length})
                  </button>
                  <button
                    type="button"
                    className="text-[10px] font-bold text-[#d92867]"
                    onClick={() => toggleMonth(items)}
                  >
                    {allSelected ? 'Clear month' : 'Select month'}
                  </button>
                </div>
                {isOpen && (
                  <div className="pb-2">
                    {items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-start gap-2 py-1 text-[11px] font-normal"
                      >
                        <input
                          className="mt-0.5"
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => toggle(item.id)}
                        />
                        <span>{item.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        {!groups.size && (
          <p className="py-3 text-[11px] text-[#777283]">No matching published content.</p>
        )}
      </div>
      <span className="text-[10px] font-normal text-[#777283]">{selected.length} selected</span>
    </fieldset>
  );
}

export default function AdvertisingPage({
  token,
  onNotice,
}: {
  token: string;
  onNotice: (message: string) => void;
}) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [articles, setArticles] = useState<Target[]>([]);
  const [videos, setVideos] = useState<Target[]>([]);
  const [editing, setEditing] = useState<Advertisement | null>(null);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [articleMode, setArticleMode] = useState<TargetMode>('ALL');
  const [articleIds, setArticleIds] = useState<string[]>([]);
  const [videoMode, setVideoMode] = useState<TargetMode>('ALL');
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [sidebarPosition, setSidebarPosition] = useState<'LEFT' | 'RIGHT' | 'BOTH'>('BOTH');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function request(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${API}${path}`, { ...options, headers });
    const payload = (await response.json().catch(() => null)) as {
      data?: unknown;
      message?: string;
    } | null;
    if (!response.ok) throw new Error(payload?.message ?? 'Unable to complete the request.');
    return payload?.data;
  }
  async function refresh() {
    setLoading(true);
    try {
      const [adData, targets] = (await Promise.all([
        request('/api/admin/advertisements'),
        request('/api/admin/ad-targets'),
      ])) as [Advertisement[], { articles: Target[]; videos: Target[] }];
      setAds(adData);
      setArticles(targets.articles);
      setVideos(targets.videos);
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Unable to load advertisements.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void refresh();
  }, [token]);

  function resetForm() {
    setEditing(null);
    setName('');
    setImageUrl('');
    setRedirectUrl('');
    setEnabled(true);
    setLocations([]);
    setArticleMode('ALL');
    setArticleIds([]);
    setVideoMode('ALL');
    setVideoIds([]);
    setSidebarPosition('BOTH');
  }
  function edit(ad: Advertisement) {
    setEditing(ad);
    setName(ad.name);
    setImageUrl(ad.imageUrl);
    setRedirectUrl(ad.redirectUrl);
    setEnabled(ad.enabled);
    setLocations(ad.locations);
    setArticleMode(ad.articleTargetMode);
    setArticleIds(ad.articles.map((target) => target.article.id));
    setVideoMode(ad.videoTargetMode);
    setVideoIds(ad.videos.map((target) => target.video.id));
    setSidebarPosition(ad.sidebarPosition);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!locations.length) return onNotice('Choose at least one display location.');
    if (
      locations.some((location) => location.startsWith('ARTICLE_')) &&
      articleMode === 'SELECTED' &&
      !articleIds.length
    )
      return onNotice('Select articles for this advertisement.');
    if (
      locations.some((location) => location.startsWith('VIDEO_')) &&
      videoMode === 'SELECTED' &&
      !videoIds.length
    )
      return onNotice('Select videos for this advertisement.');
    setSaving(true);
    try {
      await request(`/api/admin/advertisements${editing ? `/${editing.id}` : ''}`, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          imageUrl,
          redirectUrl,
          enabled,
          locations,
          articleTargetMode: articleMode,
          articleIds,
          videoTargetMode: videoMode,
          videoIds,
          sidebarPosition,
        }),
      });
      onNotice(editing ? 'Advertisement updated.' : 'Advertisement added.');
      resetForm();
      await refresh();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Unable to save advertisement.');
    } finally {
      setSaving(false);
    }
  }
  async function toggleEnabled(ad: Advertisement) {
    try {
      await request(`/api/admin/advertisements/${ad.id}/enabled`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !ad.enabled }),
      });
      onNotice(`Advertisement ${ad.enabled ? 'disabled' : 'enabled'}.`);
      await refresh();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Unable to update advertisement.');
    }
  }
  async function remove(ad: Advertisement) {
    if (!window.confirm(`Delete “${ad.name}”?`)) return;
    try {
      await request(`/api/admin/advertisements/${ad.id}`, { method: 'DELETE' });
      onNotice('Advertisement deleted.');
      if (editing?.id === ad.id) resetForm();
      await refresh();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Unable to delete advertisement.');
    }
  }

  const hasArticleTarget = locations.some((location) => location.startsWith('ARTICLE_'));
  const hasVideoTarget = locations.some((location) => location.startsWith('VIDEO_'));
  const hasSidebar = locations.includes('ARTICLE_SIDEBAR') || locations.includes('VIDEO_SIDEBAR');
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#d92867]">
          Advertising
        </p>
        <h1 className="mt-1 text-2xl font-extrabold">Advertisements</h1>
        <p className="mt-2 text-[13px] text-[#777283]">
          Add an image, destination, and the places it should appear.
        </p>
      </header>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(360px,520px)_1fr]">
        <form onSubmit={save} className="grid gap-4 rounded border border-[#ebe8ef] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">
              {editing ? 'Edit advertisement' : 'Add advertisement'}
            </h2>
            {editing && (
              <button type="button" className="text-xs text-[#777283]" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
          <label className="grid gap-1 text-xs font-bold">
            Advertisement name
            <input
              className={inputClass}
              required
              maxLength={160}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <MediaUpload
            token={token}
            accept="image/*"
            label="Advertisement image"
            initialUrl={imageUrl}
            onUploaded={(media) => setImageUrl(media.url)}
            onClear={() => setImageUrl('')}
          />
          <label className="grid gap-1 text-xs font-bold">
            Direct redirect URL
            <input
              className={inputClass}
              type="url"
              required
              value={redirectUrl}
              onChange={(event) => setRedirectUrl(event.target.value)}
              placeholder="https://example.com"
            />
          </label>
          <fieldset className="grid gap-3 rounded border border-[#ebe8ef] p-3">
            <legend className="px-1 text-xs font-bold">Display locations</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {locationGroups.map((group) => (
                <section key={group.title}>
                  <h3 className="mb-1 text-[11px] font-bold text-[#777283]">{group.title}</h3>
                  {group.options.map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 py-1.5 text-xs font-normal"
                    >
                      <input
                        type="checkbox"
                        checked={locations.includes(value)}
                        onChange={(event) =>
                          setLocations((current) =>
                            event.target.checked
                              ? [...current, value]
                              : current.filter((item) => item !== value),
                          )
                        }
                      />
                      {label}
                    </label>
                  ))}
                </section>
              ))}
            </div>
          </fieldset>
          {hasSidebar && (
            <fieldset className="grid gap-2 rounded border border-[#ebe8ef] p-3">
              <legend className="px-1 text-xs font-bold">Sidebar position</legend>
              <div className="flex flex-wrap gap-4">
                {(['LEFT', 'RIGHT', 'BOTH'] as const).map((side) => (
                  <label key={side} className="flex items-center gap-2 text-xs font-normal">
                    <input
                      type="radio"
                      name="sidebarPosition"
                      checked={sidebarPosition === side}
                      onChange={() => setSidebarPosition(side)}
                    />
                    {side === 'BOTH' ? 'Both' : side[0] + side.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {hasArticleTarget && (
            <section className="grid gap-2">
              <label className="grid gap-1 text-xs font-bold">
                Article selection
                <select
                  className={inputClass}
                  value={articleMode}
                  onChange={(event) => setArticleMode(event.target.value as TargetMode)}
                >
                  <option value="ALL">All Articles</option>
                  <option value="SELECTED">Select Specific Articles</option>
                </select>
              </label>
              {articleMode === 'SELECTED' && (
                <TargetPicker
                  label="Articles"
                  targets={articles}
                  selected={articleIds}
                  onChange={setArticleIds}
                />
              )}
            </section>
          )}
          {hasVideoTarget && (
            <section className="grid gap-2">
              <label className="grid gap-1 text-xs font-bold">
                Video selection
                <select
                  className={inputClass}
                  value={videoMode}
                  onChange={(event) => setVideoMode(event.target.value as TargetMode)}
                >
                  <option value="ALL">All Videos</option>
                  <option value="SELECTED">Select Specific Videos</option>
                </select>
              </label>
              {videoMode === 'SELECTED' && (
                <TargetPicker
                  label="Videos"
                  targets={videos}
                  selected={videoIds}
                  onChange={setVideoIds}
                />
              )}
            </section>
          )}
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />
            Advertisement enabled
          </label>
          <button className={buttonClass} disabled={saving || !imageUrl}>
            {saving ? 'Saving…' : editing ? 'Save advertisement' : 'Add advertisement'}
          </button>
        </form>
        <section className="rounded border border-[#ebe8ef] bg-white p-5">
          <h2 className="text-sm font-bold">
            Saved advertisements <span className="font-normal text-[#9993a1]">({ads.length})</span>
          </h2>
          {loading ? (
            <p className="py-5 text-xs text-[#777283]">Loading advertisements…</p>
          ) : (
            <div className="mt-3 grid gap-3">
              {ads.map((ad) => (
                <article
                  key={ad.id}
                  className="grid gap-3 rounded border border-[#ebe8ef] p-3 sm:grid-cols-[120px_1fr]"
                >
                  <div className="grid min-h-20 place-items-center bg-[#f7f6f9] p-2">
                    <img
                      src={ad.imageUrl}
                      alt={ad.name}
                      className="max-h-28 max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <strong className="text-xs">{ad.name}</strong>
                        <a
                          className="mt-1 block max-w-full truncate text-[10px] text-[#777283] underline"
                          href={ad.redirectUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {ad.redirectUrl}
                        </a>
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-[9px] font-bold ${ad.enabled ? 'bg-[#e9f5ed] text-[#24724f]' : 'bg-[#f2f0f4] text-[#777283]'}`}
                      >
                        {ad.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {ad.locations.map((location) => (
                        <span
                          key={location}
                          className="rounded bg-[#f4f2f6] px-2 py-1 text-[9px] text-[#504b5b]"
                        >
                          {locationLabels[location]}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] text-[#777283]">
                      {ad.articleTargetMode === 'ALL'
                        ? 'All articles'
                        : `${ad.articles.length} articles`}{' '}
                      · {ad.videoTargetMode === 'ALL' ? 'All videos' : `${ad.videos.length} videos`}
                      {ad.locations.some((location) => location.endsWith('SIDEBAR'))
                        ? ` · Sidebar ${ad.sidebarPosition.toLowerCase()}`
                        : ''}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className={secondaryButton} onClick={() => edit(ad)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className={secondaryButton}
                        onClick={() => void toggleEnabled(ad)}
                      >
                        {ad.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        className="px-2 text-[11px] font-bold text-[#a33232]"
                        onClick={() => void remove(ad)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {!ads.length && <p className="py-5 text-xs text-[#777283]">No advertisements yet.</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
