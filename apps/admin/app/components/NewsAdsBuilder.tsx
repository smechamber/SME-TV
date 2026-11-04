'use client';

import { FormEvent, useEffect, useState } from 'react';
import MediaUpload from '../MediaUpload';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Placement = 'ARTICLE_LIST' | 'BELOW_SEARCH' | 'BELOW_EVENTS';
type NewsAd = {
  id: string;
  name: string;
  imageUrl: string;
  clickUrl: string;
  placement: Placement;
  articlePosition: number;
};

const placements: Array<{ value: Placement; label: string }> = [
  { value: 'ARTICLE_LIST', label: 'Between news articles' },
  { value: 'BELOW_SEARCH', label: 'Below the search bar' },
  { value: 'BELOW_EVENTS', label: 'Below upcoming events' },
];

function validDestination(value: string) {
  return value.startsWith('/') ? !value.startsWith('//') : /^https?:\/\//i.test(value);
}

function AdPreview({ imageUrl, name }: { imageUrl: string; name: string }) {
  return (
    <div className="flex aspect-video w-full overflow-hidden rounded border border-[#dedbe3] bg-[#f2f0f4]">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-contain" />
      ) : (
        <div className="grid h-full place-items-center text-xs font-normal text-[#9993a1]">
          Ad image preview
        </div>
      )}
    </div>
  );
}

export default function NewsAdsBuilder({
  token,
  onNotice,
}: {
  token: string;
  onNotice: (message: string) => void;
}) {
  const [ads, setAds] = useState<NewsAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState(false);
  const [name, setName] = useState('');
  const [clickUrl, setClickUrl] = useState('');
  const [placement, setPlacement] = useState<Placement | ''>('');
  const [articlePosition, setArticlePosition] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(`${API}/api/admin/news-page/ads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const payload = (await response.json()) as { data?: NewsAd[]; message?: string };
        if (!response.ok || !payload.data) throw new Error(payload.message ?? 'Unable to load ads');
        if (mounted) setAds(payload.data);
      })
      .catch((error) => {
        if (mounted) onNotice(error instanceof Error ? error.message : 'Unable to load ads');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [token, onNotice]);

  function openAdForm(ad?: NewsAd) {
    setEditingAdId(ad?.id ?? null);
    setName(ad?.name ?? '');
    setClickUrl(ad?.clickUrl ?? '');
    setPlacement(ad?.placement ?? '');
    setArticlePosition(ad?.articlePosition ?? 1);
    setImageUrl(ad?.imageUrl ?? '');
    setFormError('');
    setUploadStep(Boolean(ad));
    setCreating(true);
  }

  function continueToUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !clickUrl.trim()) {
      setFormError('Enter an ad name and destination URL to continue.');
      return;
    }
    if (!validDestination(clickUrl.trim())) {
      setFormError('Enter a valid http(s) URL or a site path starting with /.');
      return;
    }
    setFormError('');
    setUploadStep(true);
  }

  async function saveAd() {
    if (!imageUrl || !placement) {
      setFormError(
        !imageUrl
          ? 'Upload an image before saving this ad.'
          : 'Choose an ad placement before saving this ad.',
      );
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      const response = await fetch(
        `${API}/api/admin/news-page/ads${editingAdId ? `/${encodeURIComponent(editingAdId)}` : ''}`,
        {
          method: editingAdId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            clickUrl: clickUrl.trim(),
            placement,
            imageUrl,
            articlePosition,
          }),
        },
      );
      const payload = (await response.json()) as { data?: NewsAd; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message ?? 'Unable to save ad');
      setAds((current) =>
        editingAdId
          ? current.map((item) => (item.id === editingAdId ? payload.data! : item))
          : [...current, payload.data!],
      );
      setCreating(false);
      setUploadStep(false);
      setName('');
      setClickUrl('');
      setImageUrl('');
      setEditingAdId(null);
      onNotice('Ad saved and added to the news page.');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save ad');
    } finally {
      setBusy(false);
    }
  }

  async function deleteAd(ad: NewsAd) {
    if (!window.confirm(`Delete “${ad.name}” from the news page?`)) return;
    try {
      const response = await fetch(`${API}/api/admin/news-page/ads/${encodeURIComponent(ad.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Unable to delete ad');
      setAds((current) => current.filter((item) => item.id !== ad.id));
      onNotice('Ad deleted from the news page.');
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Unable to delete ad');
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] p-[22px] md:p-[34px]">
      <div>
        <p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">
          PUBLISHING CONTROLS
        </p>
        <h1 className="text-[27px] font-bold tracking-[-.04em]">News Page Builder</h1>
        <p className="mt-2 text-[13px] text-[#777283]">
          Create ads for the news page and choose where each one appears.
        </p>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded border border-[#ebe8ef] bg-white p-5">
          {creating ? (
            <div className="grid gap-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold">{editingAdId ? 'Edit ad' : 'Add ad'}</h2>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#777283] hover:text-[#d92867]"
                  onClick={() => setCreating(false)}
                >
                  Cancel
                </button>
              </div>

              {!uploadStep ? (
                <form onSubmit={continueToUpload} className="grid gap-4">
                  <label className="grid gap-2 text-xs font-bold text-[#504b5b]">
                    Ad name
                    <input
                      required
                      maxLength={80}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter ad name"
                      className="rounded border border-[#dedbe3] px-3 py-2.5 text-xs font-normal"
                    />
                  </label>
                  <label className="grid gap-2 text-xs font-bold text-[#504b5b]">
                    Destination URL
                    <input
                      required
                      value={clickUrl}
                      onChange={(event) => setClickUrl(event.target.value)}
                      placeholder="https://example.com or /news"
                      className="rounded border border-[#dedbe3] px-3 py-2.5 text-xs font-normal"
                    />
                    <span className="font-normal text-[#777283]">
                      Visitors open this page when they click the ad.
                    </span>
                  </label>
                  {formError && <p className="text-xs text-[#a33232]">{formError}</p>}
                  <button
                    type="submit"
                    className="w-max rounded bg-[#1e1b4b] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#302b70]"
                  >
                    Continue to upload
                  </button>
                </form>
              ) : (
                <div className="grid gap-5">
                  <div className="rounded bg-[#f7f6f9] p-3 text-xs leading-5 text-[#504b5b]">
                    <strong>{name}</strong>
                    <span className="block break-all text-[#777283]">{clickUrl}</span>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-bold text-[#504b5b]">Upload ad image</h3>
                    <MediaUpload
                      token={token}
                      accept="image/jpeg,image/png,image/webp"
                      label="Choose image"
                      initialUrl={imageUrl}
                      onUploaded={(media) => setImageUrl(media.url)}
                      onClear={() => setImageUrl('')}
                    />
                  </div>
                  <label className="grid gap-2 text-xs font-bold text-[#504b5b]">
                    Ad placement
                    <select
                      required
                      value={placement}
                      onChange={(event) => setPlacement(event.target.value as Placement)}
                      className="rounded border border-[#dedbe3] bg-white px-3 py-2.5 text-xs font-normal"
                    >
                      <option value="" disabled>
                        Select placement
                      </option>
                      {placements.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {placement === 'ARTICLE_LIST' && (
                    <label className="grid gap-2 text-xs font-bold text-[#504b5b]">
                      Show after how many articles?
                      <input
                        required
                        min={1}
                        max={100}
                        type="number"
                        value={articlePosition}
                        onChange={(event) =>
                          setArticlePosition(Math.max(1, Number(event.target.value) || 1))
                        }
                        className="rounded border border-[#dedbe3] px-3 py-2.5 text-xs font-normal"
                      />
                      <span className="font-normal leading-5 text-[#777283]">
                        Enter 4 to show this ad after the 4th article.
                      </span>
                    </label>
                  )}
                  <div>
                    <h3 className="mb-3 text-xs font-bold text-[#504b5b]">Preview</h3>
                    <div className="grid gap-4 rounded border border-[#ebe8ef] bg-[#fcfbfd] p-4 md:grid-cols-[minmax(0,1fr)_220px]">
                      <div className="space-y-3">
                        <div className="rounded bg-white p-3 text-xs text-[#777283]">
                          Sample news article
                        </div>
                        {placement === 'ARTICLE_LIST' && (
                          <div className="grid gap-2">
                            <AdPreview imageUrl={imageUrl} name={name} />
                            <span className="text-[11px] text-[#777283]">
                              Preview: ad appears after article {articlePosition}.
                            </span>
                          </div>
                        )}
                        <div className="rounded bg-white p-3 text-xs text-[#777283]">
                          Next news article
                        </div>
                      </div>
                      <aside className="space-y-3">
                        <div className="rounded bg-white p-3 text-xs text-[#777283]">
                          Search news
                        </div>
                        {placement === 'BELOW_SEARCH' && (
                          <AdPreview imageUrl={imageUrl} name={name} />
                        )}
                        <div className="rounded bg-white p-3 text-xs font-bold">
                          Upcoming events
                        </div>
                        {placement === 'BELOW_EVENTS' && (
                          <AdPreview imageUrl={imageUrl} name={name} />
                        )}
                      </aside>
                    </div>
                  </div>
                  {formError && <p className="text-xs text-[#a33232]">{formError}</p>}
                  <div className="flex flex-wrap justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setUploadStep(false)}
                      className="rounded border border-[#dedbe3] px-5 py-2.5 text-xs font-bold text-[#504b5b]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => void saveAd()}
                      disabled={busy || !imageUrl || !placement}
                      className="rounded bg-[#d92867] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b81d53] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy ? 'Saving...' : editingAdId ? 'Update ad' : 'Save ad'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded border border-dashed border-[#dedbe3] p-8 text-center">
              <h2 className="text-sm font-bold">Create a news page ad</h2>
              <p className="mt-2 text-xs text-[#777283]">
                Add an ad name and destination, then upload the image. Placement and article
                position are selected on the next step.
              </p>
            </div>
          )}
        </section>

        <aside className="rounded border border-[#ebe8ef] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold">Saved ads</h2>
            <button
              type="button"
              onClick={() => openAdForm()}
              disabled={creating}
              className="rounded bg-[#d92867] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#b81d53]"
            >
              Add Ad
            </button>
          </div>
          {loading ? (
            <p className="mt-4 text-xs text-[#777283]">Loading ads...</p>
          ) : ads.length ? (
            <ul className="mt-4 divide-y divide-[#ebe8ef]">
              {ads.map((ad) => (
                <li key={ad.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0 truncate text-xs font-semibold" title={ad.name}>
                    {ad.name}
                    <small className="mt-1 block font-normal text-[#777283]">
                      {ad.placement === 'ARTICLE_LIST'
                        ? `After article ${ad.articlePosition}`
                        : placements.find((option) => option.value === ad.placement)?.label}
                    </small>
                  </span>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openAdForm(ad)}
                      disabled={creating}
                      aria-label={`Edit ${ad.name}`}
                      className="text-[10px] font-bold text-[#1e1b4b] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteAd(ad)}
                      aria-label={`Delete ${ad.name}`}
                      className="text-[10px] font-bold text-[#a33232] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-[#777283]">No ads have been added yet.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
