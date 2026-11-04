'use client';

import { useEffect, useState } from 'react';
import MediaUpload from '../MediaUpload';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Placement = 'ARTICLE_LIST' | 'BELOW_SEARCH' | 'BELOW_EVENTS';
type NewsPageConfig = { imageUrl: string; placement: Placement };

const placements: Array<{ value: Placement; label: string }> = [
  { value: 'ARTICLE_LIST', label: 'Between news articles' },
  { value: 'BELOW_SEARCH', label: 'Below the search bar' },
  { value: 'BELOW_EVENTS', label: 'Below upcoming events' },
];

function PreviewImage({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="aspect-video w-full max-w-[360px] overflow-hidden rounded border border-[#dedbe3] bg-[#f2f0f4]">
      {imageUrl ? (
        <img src={imageUrl} alt="News page image preview" className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full place-items-center text-xs font-normal text-[#9993a1]">
          Uploaded image preview
        </div>
      )}
    </div>
  );
}

export default function NewsPageBuilder({
  token,
  onNotice,
}: {
  token: string;
  onNotice: (message: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [placement, setPlacement] = useState<Placement>('ARTICLE_LIST');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(`${API}/api/admin/news-page`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const payload = (await response.json()) as {
          data?: NewsPageConfig;
          message?: string;
        };
        if (!response.ok || !payload.data) throw new Error(payload.message ?? 'Unable to load news page settings');
        if (mounted) {
          setImageUrl(payload.data.imageUrl ?? '');
          setPlacement(payload.data.placement ?? 'ARTICLE_LIST');
        }
      })
      .catch((error) => {
        if (mounted) onNotice(error instanceof Error ? error.message : 'Unable to load news page settings');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [token, onNotice]);

  async function save() {
    setBusy(true);
    try {
      const response = await fetch(`${API}/api/admin/news-page`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl, placement }),
      });
      const payload = (await response.json()) as { data?: NewsPageConfig; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message ?? 'Unable to save news page settings');
      setImageUrl(payload.data.imageUrl ?? '');
      setPlacement(payload.data.placement ?? 'ARTICLE_LIST');
      onNotice('News page image saved.');
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Unable to save news page settings');
    } finally {
      setBusy(false);
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
          Upload an image, choose where it appears, and preview the fixed image area.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">
        <section className="grid content-start gap-5 rounded border border-[#ebe8ef] bg-white p-5">
          <div>
            <h2 className="mb-3 text-sm font-bold">News page image</h2>
            <MediaUpload
              token={token}
              accept="image/jpeg,image/png,image/webp"
              label="Upload image"
              initialUrl={imageUrl}
              onUploaded={(media) => setImageUrl(media.url)}
              onClear={() => setImageUrl('')}
            />
          </div>

          <label className="grid gap-2 text-xs font-bold text-[#504b5b]">
            Image placement
            <select
              value={placement}
              onChange={(event) => setPlacement(event.target.value as Placement)}
              className="rounded border border-[#dedbe3] bg-white px-3 py-2.5 text-xs font-normal"
            >
              {placements.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <p className="text-[11px] leading-5 text-[#777283]">
            The image is cropped to a fixed 16:9 frame so it will not stretch or change the page layout.
          </p>
        </section>

        <section className="rounded border border-[#ebe8ef] bg-white p-5">
          <h2 className="mb-4 text-sm font-bold">Preview</h2>
          {loading ? (
            <p className="text-xs text-[#777283]">Loading current settings...</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_250px]">
              <div className="space-y-4">
                <article className="grid gap-3 border-b border-[#ebe8ef] pb-4 sm:grid-cols-[minmax(0,1fr)_150px]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wide text-[#777283]">Latest news</span>
                    <h3 className="mt-1 text-sm font-bold">Sample news article title</h3>
                    <p className="mt-2 text-[11px] leading-5 text-[#777283]">A short article summary appears here.</p>
                  </div>
                  <div className="aspect-video rounded bg-[#f2f0f4]" />
                </article>
                {placement === 'ARTICLE_LIST' && <PreviewImage imageUrl={imageUrl} />}
                <article className="grid gap-3 border-b border-[#ebe8ef] pb-4 sm:grid-cols-[minmax(0,1fr)_150px]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wide text-[#777283]">Latest news</span>
                    <h3 className="mt-1 text-sm font-bold">Another sample article</h3>
                    <p className="mt-2 text-[11px] leading-5 text-[#777283]">The next article follows the image.</p>
                  </div>
                  <div className="aspect-video rounded bg-[#f2f0f4]" />
                </article>
              </div>

              <aside className="space-y-4">
                <div className="rounded border border-[#ebe8ef] p-3 text-[11px] text-[#777283]">Search news</div>
                {placement === 'BELOW_SEARCH' && <PreviewImage imageUrl={imageUrl} />}
                <div className="rounded border border-[#ebe8ef] p-3 text-[11px] font-bold">Upcoming events</div>
                {placement === 'BELOW_EVENTS' && <PreviewImage imageUrl={imageUrl} />}
              </aside>
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || loading}
          className="rounded bg-[#d92867] px-6 py-3 text-xs font-bold text-white hover:bg-[#b81d53] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
