'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import MediaUpload from '../MediaUpload';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const slots = [
  ['HOMEPAGE_TOP', 'Homepage top'],
  ['HOMEPAGE_MIDDLE', 'Homepage middle'],
  ['ARTICLE_TOP', 'Article top'],
  ['ARTICLE_MIDDLE', 'Article middle'],
  ['ARTICLE_BOTTOM', 'Article bottom'],
  ['SIDEBAR', 'Sidebar'],
  ['FOOTER', 'Footer'],
  ['NEWS_LIST_TOP', 'News list top'],
  ['VIDEO_LIST_TOP', 'Video list top'],
] as const;
type Slot = (typeof slots)[number][0];
type Advertiser = {
  id: string;
  companyName: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  notes?: string | null;
  _count?: { campaigns: number };
};
type Creative = {
  id: string;
  campaignId: string;
  name: string;
  mediaType: 'IMAGE' | 'VIDEO';
  desktopUrl?: string | null;
  tabletUrl?: string | null;
  mobileUrl?: string | null;
  clickUrl: string;
  altText?: string | null;
};
type Campaign = {
  id: string;
  advertiserId: string;
  name: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startsAt: string;
  endsAt: string;
  advertiser: Advertiser;
  creatives: Creative[];
};
type Placement = {
  id: string;
  campaignId: string;
  creativeId: string;
  slot: Slot;
  targetArticleIds: string[];
  targetCategoryIds: string[];
  targetTags: string[];
  excludedArticleIds: string[];
  defaultForOtherArticles: boolean;
  enabled: boolean;
  priority: number;
  campaign: Campaign;
  creative: Creative;
};
type TargetArticle = { id: string; title: string; tags: string[]; categoryId?: string | null };
type TargetCategory = { id: string; name: string };
type ReportRow = { eventType: 'IMPRESSION' | 'CLICK'; _count: { _all: number }; name?: string; slot?: Slot };
type Reports = {
  totals: Record<string, number>;
  byCampaign: Array<ReportRow & { campaignId: string }>;
  byAdvertiser: Array<ReportRow & { advertiserId: string }>;
  bySlot: Array<ReportRow & { slot: Slot }>;
};

const inputClass = 'w-full rounded border border-[#dedbe3] bg-white px-3 py-2.5 text-xs font-normal text-[#282338]';
const buttonClass = 'rounded bg-[#d92867] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#b81d53] disabled:opacity-50';
const secondaryButton = 'rounded border border-[#dedbe3] bg-white px-3 py-2 text-[11px] font-bold text-[#504b5b]';

function toLocalDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function Preview({ creative, device }: { creative: Partial<Creative>; device: 'desktop' | 'tablet' | 'mobile' }) {
  const source =
    (device === 'mobile' ? creative.mobileUrl : device === 'tablet' ? creative.tabletUrl : creative.desktopUrl) ||
    creative.desktopUrl || creative.tabletUrl || creative.mobileUrl;
  return (
    <div className={`mx-auto overflow-hidden rounded border border-[#dedbe3] bg-[#f4f2f6] ${device === 'mobile' ? 'max-w-[220px]' : device === 'tablet' ? 'max-w-[420px]' : 'max-w-full'}`}>
      <div className="border-b border-[#dedbe3] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#777283]">{device} preview</div>
      <div className="grid min-h-[110px] place-items-center p-3">
        {source && creative.mediaType === 'VIDEO' ? (
          <video className="max-h-52 w-full" controls src={source} />
        ) : source ? (
          <img className="max-h-52 w-full object-contain" src={source} alt={creative.altText || creative.name || 'Advertisement preview'} />
        ) : (
          <span className="text-xs text-[#9993a1]">Upload a creative to preview it here.</span>
        )}
      </div>
    </div>
  );
}

export default function AdvertisingPage({ token, onNotice }: { token: string; onNotice: (message: string) => void }) {
  const [tab, setTab] = useState<'campaigns' | 'companies' | 'placements' | 'reports'>('campaigns');
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [articles, setArticles] = useState<TargetArticle[]>([]);
  const [categories, setCategories] = useState<TargetCategory[]>([]);
  const [reports, setReports] = useState<Reports | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingAdvertiser, setEditingAdvertiser] = useState<Advertiser | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editingCreative, setEditingCreative] = useState<Creative | null>(null);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [creativeName, setCreativeName] = useState('');
  const [creativeType, setCreativeType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [creativeUrls, setCreativeUrls] = useState({ desktopUrl: '', tabletUrl: '', mobileUrl: '' });
  const [creativeClickUrl, setCreativeClickUrl] = useState('');
  const [creativeAltText, setCreativeAltText] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [saving, setSaving] = useState(false);

  async function request(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${API}${path}`, { ...options, headers });
    const payload = (await response.json().catch(() => null)) as { data?: unknown; message?: string } | null;
    if (!response.ok) throw new Error(payload?.message ?? 'Unable to complete the request.');
    return payload?.data;
  }

  async function refresh() {
    setLoading(true);
    try {
      const [companyData, campaignData, placementData, targetData] = await Promise.all([
        request('/api/admin/advertisers'),
        request('/api/admin/ad-campaigns'),
        request('/api/admin/ad-placements'),
        request('/api/admin/ad-targets'),
      ]) as [Advertiser[], Campaign[], Placement[], { articles: TargetArticle[]; categories: TargetCategory[] }];
      setAdvertisers(companyData);
      setCampaigns(campaignData);
      setPlacements(placementData);
      setArticles(targetData.articles);
      setCategories(targetData.categories);
      if (!selectedCampaignId && campaignData[0]) setSelectedCampaignId(campaignData[0].id);
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Unable to load advertising data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, [token]);
  useEffect(() => {
    if (tab !== 'reports') return;
    const query = new URLSearchParams();
    if (dateFrom) query.set('from', new Date(`${dateFrom}T00:00:00.000Z`).toISOString());
    if (dateTo) query.set('to', new Date(`${dateTo}T23:59:59.999Z`).toISOString());
    void request(`/api/admin/ad-reports${query.size ? `?${query}` : ''}`)
      .then((data) => setReports(data as Reports))
      .catch((error) => onNotice(error instanceof Error ? error.message : 'Unable to load reports.'));
  }, [tab, dateFrom, dateTo, token]);

  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId);
  const creatives = selectedCampaign?.creatives ?? [];
  const editingCompanyForm = editingAdvertiser;
  const currentCreative = useMemo(() => ({
    name: creativeName,
    mediaType: creativeType,
    ...creativeUrls,
    clickUrl: creativeClickUrl,
    altText: creativeAltText,
  }), [creativeName, creativeType, creativeUrls, creativeClickUrl, creativeAltText]);

  async function saveAdvertiser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    setSaving(true);
    try {
      await request(`/api/admin/advertisers${editingCompanyForm ? `/${editingCompanyForm.id}` : ''}`, {
        method: editingCompanyForm ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setEditingAdvertiser(null);
      onNotice('Company saved.');
      await refresh();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to save company.'); }
    finally { setSaving(false); }
  }

  async function removeAdvertiser(advertiser: Advertiser) {
    if (!window.confirm(`Delete ${advertiser.companyName}?`)) return;
    try {
      await request(`/api/admin/advertisers/${advertiser.id}`, { method: 'DELETE' });
      onNotice('Company deleted.');
      await refresh();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to delete company.'); }
  }

  async function saveCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      advertiserId: form.get('advertiserId'),
      name: form.get('name'),
      status: form.get('status'),
      startsAt: new Date(String(form.get('startsAt'))).toISOString(),
      endsAt: new Date(String(form.get('endsAt'))).toISOString(),
    };
    setSaving(true);
    try {
      const data = await request(`/api/admin/ad-campaigns${editingCampaign ? `/${editingCampaign.id}` : ''}`, {
        method: editingCampaign ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }) as Campaign;
      setSelectedCampaignId(data.id);
      setEditingCampaign(null);
      onNotice('Campaign saved.');
      await refresh();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to save campaign.'); }
    finally { setSaving(false); }
  }

  async function removeCampaign(campaign: Campaign) {
    if (!window.confirm(`Delete “${campaign.name}” and its creatives and placements?`)) return;
    try {
      await request(`/api/admin/ad-campaigns/${campaign.id}`, { method: 'DELETE' });
      if (selectedCampaignId === campaign.id) setSelectedCampaignId('');
      onNotice('Campaign deleted.');
      await refresh();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to delete campaign.'); }
  }

  async function saveCreative(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCampaignId) return onNotice('Choose a campaign first.');
    setSaving(true);
    const body = {
      name: creativeName,
      mediaType: creativeType,
      ...creativeUrls,
      clickUrl: creativeClickUrl,
      altText: creativeAltText,
    };
    try {
      await request(editingCreative
        ? `/api/admin/ad-creatives/${editingCreative.id}`
        : `/api/admin/ad-campaigns/${selectedCampaignId}/creatives`, {
        method: editingCreative ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      setEditingCreative(null);
      setCreativeName('');
      setCreativeType('IMAGE');
      setCreativeUrls({ desktopUrl: '', tabletUrl: '', mobileUrl: '' });
      setCreativeClickUrl('');
      setCreativeAltText('');
      onNotice('Creative saved. Assign it to one or more page positions below.');
      await refresh();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to save creative.'); }
    finally { setSaving(false); }
  }

  function editCreative(creative: Creative) {
    setEditingCreative(creative);
    setSelectedCampaignId(creative.campaignId);
    setCreativeName(creative.name);
    setCreativeType(creative.mediaType);
    setCreativeUrls({ desktopUrl: creative.desktopUrl ?? '', tabletUrl: creative.tabletUrl ?? '', mobileUrl: creative.mobileUrl ?? '' });
    setCreativeClickUrl(creative.clickUrl);
    setCreativeAltText(creative.altText ?? '');
  }

  async function removeCreative(creative: Creative) {
    if (!window.confirm(`Delete creative “${creative.name}” and its placements?`)) return;
    try {
      await request(`/api/admin/ad-creatives/${creative.id}`, { method: 'DELETE' });
      onNotice('Creative deleted.');
      await refresh();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to delete creative.'); }
  }

  async function savePlacement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      campaignId: form.get('campaignId'),
      creativeId: form.get('creativeId'),
      slot: form.get('slot'),
      targetArticleIds: form.getAll('targetArticleIds'),
      targetCategoryIds: form.getAll('targetCategoryIds'),
      targetTags: String(form.get('targetTags') ?? '').split(',').map((tag) => tag.trim()).filter(Boolean),
      excludedArticleIds: form.getAll('excludedArticleIds'),
      defaultForOtherArticles: form.has('defaultForOtherArticles'),
      enabled: form.has('enabled'),
      priority: Number(form.get('priority') ?? 0),
    };
    setSaving(true);
    try {
      await request(`/api/admin/ad-placements${editingPlacement ? `/${editingPlacement.id}` : ''}`, {
        method: editingPlacement ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      setEditingPlacement(null);
      onNotice('Placement saved.');
      await refresh();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to save placement.'); }
    finally { setSaving(false); }
  }

  async function removePlacement(placement: Placement) {
    if (!window.confirm('Delete this placement?')) return;
    try {
      await request(`/api/admin/ad-placements/${placement.id}`, { method: 'DELETE' });
      onNotice('Placement deleted.');
      await refresh();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to delete placement.'); }
  }

  async function setCampaignStatus(campaign: Campaign, status: Campaign['status']) {
    const body = {
      advertiserId: campaign.advertiserId,
      name: campaign.name,
      status,
      startsAt: campaign.startsAt,
      endsAt: campaign.endsAt,
    };
    try {
      await request(`/api/admin/ad-campaigns/${campaign.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      onNotice(`Campaign ${status.toLowerCase()}.`);
      await refresh();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to change campaign status.'); }
  }

  const tabButton = (key: typeof tab, label: string) => (
    <button type="button" onClick={() => setTab(key)} className={`rounded px-4 py-2.5 text-xs font-bold ${tab === key ? 'bg-[#221b30] text-white' : 'text-[#777283] hover:bg-[#f2f0f4]'}`}>{label}</button>
  );

  return (
    <div className="mx-auto max-w-[1400px] p-[22px] md:p-[34px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">REVENUE &amp; PARTNERSHIPS</p>
          <h1 className="text-[27px] font-bold tracking-[-.04em]">Advertising</h1>
          <p className="mt-2 text-[13px] text-[#777283]">Manage advertisers, campaigns, creative assets, placements, and performance.</p>
        </div>
        <button type="button" className={secondaryButton} onClick={() => void refresh()}>Refresh data</button>
      </div>
      <nav className="mt-6 flex flex-wrap gap-1 rounded border border-[#ebe8ef] bg-white p-1">
        {tabButton('campaigns', 'Campaigns & creatives')}{tabButton('companies', 'Advertisers')}{tabButton('placements', 'Placements')}{tabButton('reports', 'Analytics')}
      </nav>

      {loading ? <p className="mt-6 text-sm text-[#777283]">Loading advertising data…</p> : null}

      {tab === 'companies' && (
        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
          <form key={editingAdvertiser?.id ?? 'new-advertiser'} onSubmit={saveAdvertiser} className="grid gap-3 rounded border border-[#ebe8ef] bg-white p-5">
            <div className="flex items-center justify-between"><h2 className="text-sm font-bold">{editingAdvertiser ? 'Edit advertiser' : 'Add advertiser'}</h2>{editingAdvertiser && <button type="button" className="text-xs text-[#777283]" onClick={() => setEditingAdvertiser(null)}>Cancel edit</button>}</div>
            <label className="grid gap-1 text-xs font-bold">Company name<input className={inputClass} name="companyName" required minLength={2} maxLength={160} defaultValue={editingAdvertiser?.companyName} /></label>
            <label className="grid gap-1 text-xs font-bold">Contact person<input className={inputClass} name="contactName" defaultValue={editingAdvertiser?.contactName ?? ''} /></label>
            <div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-xs font-bold">Email<input className={inputClass} name="email" type="email" defaultValue={editingAdvertiser?.email ?? ''} /></label><label className="grid gap-1 text-xs font-bold">Phone<input className={inputClass} name="phone" defaultValue={editingAdvertiser?.phone ?? ''} /></label></div>
            <label className="grid gap-1 text-xs font-bold">Website<input className={inputClass} name="website" type="url" placeholder="https://example.com" defaultValue={editingAdvertiser?.website ?? ''} /></label>
            <label className="grid gap-1 text-xs font-bold">Notes<textarea className={inputClass} name="notes" rows={3} defaultValue={editingAdvertiser?.notes ?? ''} /></label>
            <button className={buttonClass} disabled={saving}>{saving ? 'Saving…' : editingAdvertiser ? 'Save changes' : 'Add advertiser'}</button>
          </form>
          <section className="rounded border border-[#ebe8ef] bg-white p-5"><h2 className="text-sm font-bold">Advertisers <span className="font-normal text-[#9993a1]">({advertisers.length})</span></h2><div className="mt-3 divide-y divide-[#ebe8ef]">{advertisers.map((advertiser) => <div key={advertiser.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><strong className="text-xs">{advertiser.companyName}</strong><p className="mt-1 text-[11px] text-[#777283]">{advertiser.contactName || advertiser.email || 'No contact details'} · {advertiser._count?.campaigns ?? 0} campaigns</p></div><div className="flex gap-2"><button type="button" className={secondaryButton} onClick={() => setEditingAdvertiser(advertiser)}>Edit</button><button type="button" className="text-[11px] font-bold text-[#a33232]" onClick={() => void removeAdvertiser(advertiser)}>Delete</button></div></div>)}{!advertisers.length && <p className="py-5 text-xs text-[#777283]">Add your first advertiser company.</p>}</div></section>
        </div>
      )}

      {tab === 'campaigns' && (
        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(340px,440px)_1fr]">
          <div className="grid gap-6">
            <form key={editingCampaign?.id ?? 'new-campaign'} onSubmit={saveCampaign} className="grid gap-3 rounded border border-[#ebe8ef] bg-white p-5">
              <div className="flex items-center justify-between"><h2 className="text-sm font-bold">{editingCampaign ? 'Edit campaign' : 'Create campaign'}</h2>{editingCampaign && <button type="button" className="text-xs text-[#777283]" onClick={() => setEditingCampaign(null)}>Cancel edit</button>}</div>
              <label className="grid gap-1 text-xs font-bold">Campaign name<input className={inputClass} name="name" required minLength={2} maxLength={120} defaultValue={editingCampaign?.name} placeholder="Autumn market awareness" /></label>
              <label className="grid gap-1 text-xs font-bold">Advertiser<select className={inputClass} name="advertiserId" required defaultValue={editingCampaign?.advertiserId ?? advertisers[0]?.id ?? ''}><option value="" disabled>Select an advertiser</option>{advertisers.map((company) => <option key={company.id} value={company.id}>{company.companyName}</option>)}</select></label>
              <div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-xs font-bold">Starts<input className={inputClass} name="startsAt" type="datetime-local" required defaultValue={toLocalDate(editingCampaign?.startsAt)} /></label><label className="grid gap-1 text-xs font-bold">Ends<input className={inputClass} name="endsAt" type="datetime-local" required defaultValue={toLocalDate(editingCampaign?.endsAt)} /></label></div>
              <label className="grid gap-1 text-xs font-bold">Status<select className={inputClass} name="status" defaultValue={editingCampaign?.status ?? 'DRAFT'}><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="PAUSED">Paused</option><option value="COMPLETED">Completed</option></select></label>
              <button className={buttonClass} disabled={saving || !advertisers.length}>{saving ? 'Saving…' : editingCampaign ? 'Save campaign' : 'Create campaign'}</button>
              {!advertisers.length && <p className="text-[11px] text-[#a33232]">Add an advertiser before creating a campaign.</p>}
            </form>
            <section className="rounded border border-[#ebe8ef] bg-white p-5"><h2 className="text-sm font-bold">Campaign list</h2><div className="mt-3 grid gap-2">{campaigns.map((campaign) => <div key={campaign.id} className={`rounded border p-3 ${selectedCampaignId === campaign.id ? 'border-[#d92867] bg-[#fff9fb]' : 'border-[#ebe8ef]'}`}><div className="flex flex-wrap items-start justify-between gap-3"><button className="text-left" type="button" onClick={() => setSelectedCampaignId(campaign.id)}><strong className="text-xs">{campaign.name}</strong><span className="mt-1 block text-[10px] text-[#777283]">{campaign.advertiser.companyName} · {campaign.creatives.length} creatives</span></button><span className={`rounded px-2 py-1 text-[9px] font-bold ${campaign.status === 'ACTIVE' ? 'bg-[#e9f5ed] text-[#24724f]' : 'bg-[#f2f0f4] text-[#777283]'}`}>{campaign.status}</span></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" className={secondaryButton} onClick={() => { setEditingCampaign(campaign); setSelectedCampaignId(campaign.id); }}>Edit</button>{campaign.status === 'ACTIVE' ? <button type="button" className={secondaryButton} onClick={() => void setCampaignStatus(campaign, 'PAUSED')}>Pause</button> : campaign.status !== 'COMPLETED' ? <button type="button" className={secondaryButton} onClick={() => void setCampaignStatus(campaign, 'ACTIVE')}>Activate</button> : null}<button type="button" className="px-2 text-[11px] font-bold text-[#a33232]" onClick={() => void removeCampaign(campaign)}>Delete</button></div></div>)}{!campaigns.length && <p className="text-xs text-[#777283]">Create a campaign after adding an advertiser.</p>}</div></section>
          </div>

          <div className="grid gap-6">
            <section className="rounded border border-[#ebe8ef] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-bold">Creatives</h2><p className="mt-1 text-[11px] text-[#777283]">Upload responsive image or video assets for each campaign.</p></div><select className={`${inputClass} max-w-[280px]`} value={selectedCampaignId} onChange={(event) => setSelectedCampaignId(event.target.value)}><option value="">Select a campaign</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></div>
              {selectedCampaign && <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(280px,1fr)_minmax(250px,.8fr)]">
                <form onSubmit={saveCreative} className="grid content-start gap-3 rounded border border-[#ebe8ef] p-4">
                  <div className="flex items-center justify-between"><strong className="text-xs">{editingCreative ? 'Edit creative' : 'Add creative'}</strong>{editingCreative && <button type="button" className="text-[10px] text-[#777283]" onClick={() => { setEditingCreative(null); setCreativeName(''); setCreativeType('IMAGE'); setCreativeUrls({ desktopUrl: '', tabletUrl: '', mobileUrl: '' }); setCreativeClickUrl(''); setCreativeAltText(''); }}>Cancel edit</button>}</div>
                  <label className="grid gap-1 text-xs font-bold">Creative name<input className={inputClass} required value={creativeName} onChange={(event) => setCreativeName(event.target.value)} /></label>
                  <label className="grid gap-1 text-xs font-bold">Format<select className={inputClass} value={creativeType} onChange={(event) => setCreativeType(event.target.value as 'IMAGE' | 'VIDEO')}><option value="IMAGE">Image advertisement</option><option value="VIDEO">Video advertisement</option></select></label>
                  {(['desktopUrl', 'tabletUrl', 'mobileUrl'] as const).map((size) => <div key={size} className="rounded border border-[#ebe8ef] p-3"><MediaUpload token={token} accept={creativeType === 'VIDEO' ? 'video/*' : 'image/*'} label={`${size[0]?.toUpperCase()}${size.slice(1)} ${creativeType.toLowerCase()} asset`} initialUrl={creativeUrls[size]} onUploaded={(file) => setCreativeUrls((current) => ({ ...current, [size]: file.url }))} onClear={() => setCreativeUrls((current) => ({ ...current, [size]: '' }))} /></div>)}
                  <label className="grid gap-1 text-xs font-bold">Click destination<input className={inputClass} required value={creativeClickUrl} onChange={(event) => setCreativeClickUrl(event.target.value)} placeholder="https://advertiser.example" /></label>
                  <label className="grid gap-1 text-xs font-bold">Alt text<input className={inputClass} value={creativeAltText} onChange={(event) => setCreativeAltText(event.target.value)} maxLength={180} /></label>
                  <button className={buttonClass} disabled={saving}>{saving ? 'Saving…' : editingCreative ? 'Save creative changes' : 'Save creative'}</button>
                </form>
                <div className="grid content-start gap-3"><div className="flex flex-wrap gap-1">{(['desktop', 'tablet', 'mobile'] as const).map((device) => <button type="button" key={device} onClick={() => setPreviewDevice(device)} className={`rounded px-3 py-2 text-[10px] font-bold capitalize ${previewDevice === device ? 'bg-[#221b30] text-white' : 'bg-[#f4f2f6] text-[#777283]'}`}>{device}</button>)}</div><Preview creative={currentCreative} device={previewDevice} /><div className="divide-y divide-[#ebe8ef] rounded border border-[#ebe8ef] px-3">{creatives.map((creative) => <div key={creative.id} className="flex items-center justify-between gap-2 py-3"><span className="min-w-0"><strong className="block truncate text-xs">{creative.name}</strong><small className="text-[10px] text-[#777283]">{creative.mediaType} · {placements.filter((placement) => placement.creativeId === creative.id).length} placements</small></span><div className="flex gap-2"><button type="button" className={secondaryButton} onClick={() => editCreative(creative)}>Edit</button><button type="button" className="text-[10px] font-bold text-[#a33232]" onClick={() => void removeCreative(creative)}>Delete</button></div></div>)}{!creatives.length && <p className="py-3 text-xs text-[#777283]">No creatives for this campaign.</p>}</div></div>
              </div>}
              {!selectedCampaign && <p className="mt-4 rounded bg-[#f7f6f9] p-4 text-xs text-[#777283]">Select or create a campaign to manage its creatives.</p>}
            </section>
          </div>
        </div>
      )}

      {tab === 'placements' && (
        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(360px,520px)_1fr]">
          <form key={editingPlacement?.id ?? 'new-placement'} onSubmit={savePlacement} className="grid gap-3 rounded border border-[#ebe8ef] bg-white p-5">
            <div className="flex items-center justify-between"><h2 className="text-sm font-bold">{editingPlacement ? 'Edit placement' : 'Assign a creative to a position'}</h2>{editingPlacement && <button type="button" className="text-xs text-[#777283]" onClick={() => setEditingPlacement(null)}>Cancel edit</button>}</div>
            <label className="grid gap-1 text-xs font-bold">Campaign<select className={inputClass} name="campaignId" required defaultValue={editingPlacement?.campaignId ?? selectedCampaignId}><option value="">Select a campaign</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name} · {campaign.advertiser.companyName}</option>)}</select></label>
            <label className="grid gap-1 text-xs font-bold">Creative<select className={inputClass} name="creativeId" required defaultValue={editingPlacement?.creativeId ?? ''}><option value="">Select creative</option>{campaigns.flatMap((campaign) => campaign.creatives.map((creative) => <option key={creative.id} value={creative.id}>{campaign.name} — {creative.name}</option>))}</select><span className="font-normal text-[#777283]">Creative must belong to the selected campaign.</span></label>
            <label className="grid gap-1 text-xs font-bold">Website position<select className={inputClass} name="slot" defaultValue={editingPlacement?.slot ?? 'ARTICLE_TOP'}>{slots.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <fieldset className="grid gap-2 rounded border border-[#ebe8ef] p-3"><legend className="px-1 text-xs font-bold">Show on selected articles</legend><div className="max-h-48 overflow-auto">{articles.map((article) => <label key={article.id} className="flex items-center gap-2 py-1 text-[11px] font-normal"><input type="checkbox" name="targetArticleIds" value={article.id} defaultChecked={editingPlacement?.targetArticleIds.includes(article.id)} />{article.title}</label>)}{!articles.length && <p className="text-[11px] text-[#777283]">No articles available.</p>}</div></fieldset>
            <fieldset className="flex flex-wrap gap-x-4 gap-y-2 rounded border border-[#ebe8ef] p-3"><legend className="px-1 text-xs font-bold">Target categories</legend>{categories.map((category) => <label key={category.id} className="flex items-center gap-1.5 text-[11px] font-normal"><input type="checkbox" name="targetCategoryIds" value={category.id} defaultChecked={editingPlacement?.targetCategoryIds.includes(category.id)} />{category.name}</label>)}</fieldset>
            <label className="grid gap-1 text-xs font-bold">Target tags<input className={inputClass} name="targetTags" defaultValue={editingPlacement?.targetTags.join(', ')} placeholder="exports, manufacturing" /><span className="font-normal text-[#777283]">Comma-separated article tags. Any selected article, category, or tag can match.</span></label>
            <fieldset className="grid gap-2 rounded border border-[#ebe8ef] p-3"><legend className="px-1 text-xs font-bold">Exclude articles</legend><div className="max-h-36 overflow-auto">{articles.map((article) => <label key={article.id} className="flex items-center gap-2 py-1 text-[11px] font-normal"><input type="checkbox" name="excludedArticleIds" value={article.id} defaultChecked={editingPlacement?.excludedArticleIds.includes(article.id)} />{article.title}</label>)}</div></fieldset>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="defaultForOtherArticles" defaultChecked={editingPlacement?.defaultForOtherArticles} />Use as a default ad on other articles without a specific match</label>
            <div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-xs font-bold">Priority<input className={inputClass} name="priority" type="number" min={0} max={1000} defaultValue={editingPlacement?.priority ?? 0} /></label><label className="flex items-center gap-2 self-end pb-2 text-xs"><input type="checkbox" name="enabled" defaultChecked={editingPlacement?.enabled ?? true} />Placement enabled</label></div>
            <button className={buttonClass} disabled={saving || !campaigns.length}>{saving ? 'Saving…' : editingPlacement ? 'Save placement' : 'Create placement'}</button>
          </form>
          <section className="rounded border border-[#ebe8ef] bg-white p-5"><h2 className="text-sm font-bold">Current placements <span className="font-normal text-[#9993a1]">({placements.length})</span></h2><div className="mt-3 grid gap-2">{placements.map((placement) => <div key={placement.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-[#ebe8ef] p-3"><div className="min-w-[200px]"><strong className="text-xs">{slots.find(([value]) => value === placement.slot)?.[1] ?? placement.slot}</strong><p className="mt-1 text-[10px] text-[#777283]">{placement.campaign.name} · {placement.campaign.advertiser.companyName} · {placement.creative.name}</p><small className="text-[10px] text-[#777283]">{placement.targetArticleIds.length || placement.targetCategoryIds.length || placement.targetTags.length ? 'Targeted' : placement.defaultForOtherArticles ? 'Default for other articles' : 'General'} · {placement.enabled ? 'Enabled' : 'Disabled'}</small></div><div className="flex gap-2"><button type="button" className={secondaryButton} onClick={() => { setEditingPlacement(placement); setSelectedCampaignId(placement.campaignId); }}>Edit</button><button type="button" className="text-[10px] font-bold text-[#a33232]" onClick={() => void removePlacement(placement)}>Delete</button></div></div>)}{!placements.length && <p className="text-xs text-[#777283]">Create a campaign and creative, then assign it to a website position.</p>}</div></section>
        </div>
      )}

      {tab === 'reports' && (
        <section className="mt-6 rounded border border-[#ebe8ef] bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-sm font-bold">Campaign performance</h2><p className="mt-1 text-xs text-[#777283]">Impressions, clicks, and click-through rate by campaign, company, and placement.</p></div><div className="flex flex-wrap items-end gap-2"><label className="grid gap-1 text-[10px] font-bold text-[#777283]">From<input className={inputClass} type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label><label className="grid gap-1 text-[10px] font-bold text-[#777283]">To<input className={inputClass} type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label><button type="button" className={secondaryButton} onClick={() => { setDateFrom(''); setDateTo(''); }}>Last 30 days</button></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">{(['IMPRESSION', 'CLICK'] as const).map((type) => <div key={type} className="rounded border border-[#ebe8ef] p-4"><span className="text-[10px] font-bold uppercase text-[#777283]">{type === 'IMPRESSION' ? 'Impressions' : 'Clicks'}</span><strong className="mt-1 block text-2xl">{reports?.totals[type] ?? 0}</strong></div>)}<div className="rounded border border-[#ebe8ef] p-4"><span className="text-[10px] font-bold uppercase text-[#777283]">CTR</span><strong className="mt-1 block text-2xl">{reports?.totals.IMPRESSION ? `${((reports.totals.CLICK ?? 0) / reports.totals.IMPRESSION * 100).toFixed(2)}%` : '0.00%'}</strong></div></div>
          <div className="mt-6 grid gap-6 xl:grid-cols-3"><ReportTable title="By campaign" rows={reports?.byCampaign ?? []} /><ReportTable title="By advertiser" rows={reports?.byAdvertiser ?? []} /><ReportTable title="By placement" rows={reports?.bySlot ?? []} /></div>
        </section>
      )}
    </div>
  );
}

function ReportTable({ title, rows }: { title: string; rows: ReportRow[] }) {
  const grouped = new Map<string, { name: string; impressions: number; clicks: number }>();
  for (const row of rows) {
    const key = row.name ?? row.slot ?? 'Unknown';
    const value = grouped.get(key) ?? { name: key, impressions: 0, clicks: 0 };
    if (row.eventType === 'IMPRESSION') value.impressions = row._count._all;
    else value.clicks = row._count._all;
    grouped.set(key, value);
  }
  return <section className="min-w-0"><h3 className="mb-2 text-xs font-bold">{title}</h3><div className="overflow-auto rounded border border-[#ebe8ef]"><table className="w-full text-left text-[10px]"><thead className="bg-[#f7f6f9] text-[#777283]"><tr><th className="p-2">Name</th><th className="p-2">Impressions</th><th className="p-2">Clicks</th><th className="p-2">CTR</th></tr></thead><tbody>{[...grouped.values()].map((row) => <tr key={row.name} className="border-t border-[#ebe8ef]"><td className="max-w-[140px] truncate p-2" title={row.name}>{row.name}</td><td className="p-2">{row.impressions}</td><td className="p-2">{row.clicks}</td><td className="p-2">{row.impressions ? `${(row.clicks / row.impressions * 100).toFixed(2)}%` : '0.00%'}</td></tr>)}{!grouped.size && <tr><td className="p-3 text-[#777283]" colSpan={4}>No activity in this period.</td></tr>}</tbody></table></div></section>;
}
