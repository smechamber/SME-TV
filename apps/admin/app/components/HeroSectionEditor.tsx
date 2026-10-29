import { useMemo, useRef, useState } from 'react';
import type { Option, Section } from './homepage-builder/types';
import { inputClass } from './homepage-builder/config';
import { optionImage } from './homepage-builder/optionImage';
import OptionPreview from './homepage-builder/OptionPreview';

const MAX_LATEST_ITEMS = 300;
const LATEST_MARKER = '__HERO_LATEST__';

function splitHeroIds(ids: string[]) {
  const markerIndex = ids.indexOf(LATEST_MARKER);
  return markerIndex >= 0
    ? { mainVideoId: ids.slice(0, markerIndex)[0], latestIds: ids.slice(markerIndex + 1) }
    : { mainVideoId: ids[0], latestIds: ids.slice(1) };
}

function joinHeroIds(mainVideoId: string | undefined, latestIds: string[]) {
  return [...(mainVideoId ? [mainVideoId] : []), LATEST_MARKER, ...latestIds];
}

type ContentOption = Option & { type: 'ARTICLE' | 'VIDEO' | 'EVENT' };

export default function HeroSectionEditor({
  section,
  options,
  busy,
  onCancel,
  onSave,
}: {
  section: Section;
  options: Record<'ARTICLE' | 'VIDEO' | 'EVENT', Option[]>;
  busy: boolean;
  onCancel: () => void;
  onSave: (section: Section) => void;
}) {
  const [value, setValue] = useState(section);
  const [filter, setFilter] = useState<'ALL' | 'ARTICLE' | 'VIDEO' | 'EVENT'>('ALL');
  const [selectedPage, setSelectedPage] = useState(0);
  const selectedTrackRef = useRef<HTMLDivElement>(null);
  const allOptions = useMemo(
    () =>
      (Object.entries(options) as ['ARTICLE' | 'VIDEO' | 'EVENT', Option[]][]).flatMap(
        ([type, items]) => items.map((item) => ({ ...item, type })),
      ),
    [options],
  );
  const { mainVideoId: storedMainVideoId, latestIds: storedLatestIds } = splitHeroIds(
    value.contentIds,
  );
  const hasMainVideo = allOptions.some(
    (item) => item.type === 'VIDEO' && item.id === storedMainVideoId,
  );
  const mainVideoId = hasMainVideo ? storedMainVideoId : undefined;
  const latestIds = (
    hasMainVideo || !storedMainVideoId ? storedLatestIds : [storedMainVideoId, ...storedLatestIds]
  ).slice(0, MAX_LATEST_ITEMS);
  const mainVideo = allOptions.find(
    (item): item is ContentOption => item.type === 'VIDEO' && item.id === mainVideoId,
  );
  const latestItems = latestIds
    .map((id) => allOptions.find((item) => item.id === id))
    .filter((item): item is ContentOption => Boolean(item));
  const pageCount = Math.max(1, Math.ceil(latestItems.length / 2));
  const currentPage = Math.min(selectedPage, pageCount - 1);
  const latestPages = Array.from({ length: pageCount }, (_, page) =>
    latestItems.slice(page * 2, page * 2 + 2),
  );
  const availableItems = allOptions.filter(
    (item) => item.type !== 'EVENT' && (filter === 'ALL' || item.type === filter),
  );
  const updateIds = (contentIds: string[]) =>
    setValue((current) => ({ ...current, contentIds, itemCount: MAX_LATEST_ITEMS + 2 }));
  const setMainVideo = (id: string) =>
    updateIds(
      joinHeroIds(
        id,
        latestIds.filter((item) => item !== id),
      ),
    );
  const removeMainVideo = () => updateIds(joinHeroIds(undefined, latestIds));
  const addLatest = (id: string) => {
    if (value.contentIds.includes(id) || latestIds.length >= MAX_LATEST_ITEMS) return;
    updateIds(joinHeroIds(mainVideoId, [...latestIds, id]));
  };
  const removeLatest = (id: string) =>
    updateIds(
      joinHeroIds(
        mainVideoId,
        latestIds.filter((item) => item !== id),
      ),
    );
  const moveLatest = (index: number, direction: -1 | 1) => {
    const next = [...latestIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateIds(joinHeroIds(mainVideoId, next));
  };

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-[#221b30aa] p-4">
      <form
        className="mx-auto my-6 max-h-[calc(100vh-3rem)] w-full max-w-[1180px] overflow-auto rounded-lg bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...value,
            kind: 'HERO',
            layout: 'HERO',
            design: 'SPLIT_FEATURED',
            source: 'MANUAL',
            contentType: 'MIXED',
            displayOrder: 0,
            itemCount: MAX_LATEST_ITEMS + 2,
          });
        }}
      >
        <div className="flex items-center justify-between border-b border-[#ebe8ef] pb-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#d92867]">
              Fixed homepage section
            </p>
            <h2 className="mt-1 text-lg font-bold">Hero + Latest</h2>
            <p className="mt-1 text-[11px] text-[#777283]">
              Choose one main video, then add and order the articles or videos in Latest.
            </p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close editor">
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <section className="rounded border border-[#ebe8ef] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Main video</h3>
                <p className="mt-1 text-[10px] text-[#777283]">
                  This video fills the large left panel.
                </p>
              </div>
              {mainVideo && (
                <button
                  type="button"
                  className="text-[10px] font-bold text-[#d92867]"
                  onClick={removeMainVideo}
                >
                  Remove
                </button>
              )}
            </div>
            {mainVideo ? (
              <div className="overflow-hidden rounded border border-[#ebe8ef]">
                <OptionPreview
                  item={mainVideo}
                  className="aspect-video w-full bg-[#1e1b4b] object-cover"
                />
                <p className="p-3 text-xs font-semibold">{mainVideo.title}</p>
              </div>
            ) : (
              <p className="rounded border border-dashed border-[#d8cfdc] p-5 text-center text-xs text-[#777283]">
                Select a published video from Content Studio.
              </p>
            )}
            <div className="mt-3 max-h-[300px] space-y-2 overflow-y-auto">
              {options.VIDEO.map((video) => (
                <button
                  type="button"
                  key={video.id}
                  onClick={() => setMainVideo(video.id)}
                  className={`flex w-full items-center gap-3 rounded border p-2 text-left ${mainVideoId === video.id ? 'border-[#d92867] bg-[#fff5f8]' : 'border-[#ebe8ef] hover:border-[#d92867]'}`}
                >
                  <span
                    className="h-12 w-20 shrink-0 rounded bg-[#eeeaf1] bg-cover bg-center"
                    style={
                      optionImage(video)
                        ? { backgroundImage: `url('${optionImage(video)}')` }
                        : undefined
                    }
                  />
                  <span className="line-clamp-2 text-[11px] font-semibold">{video.title}</span>
                </button>
              ))}
              {!options.VIDEO.length && (
                <p className="text-[11px] text-[#777283]">No published videos found.</p>
              )}
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded border border-[#ebe8ef] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Latest carousel</h3>
                  <p className="mt-1 text-[10px] text-[#777283]">
                    Two items appear stacked per slide. Add more to continue in horizontal slides.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#777283]">{latestItems.length} selected</span>
                  <button
                    type="button"
                    disabled={currentPage === 0}
                    className="rounded border px-2 py-1 text-xs disabled:opacity-40"
                    aria-label="Previous preview page"
                    onClick={() =>
                      selectedTrackRef.current?.scrollBy({
                        left: -(selectedTrackRef.current.clientWidth * 0.82),
                        behavior: 'smooth',
                      })
                    }
                  >
                    &#8249;
                  </button>
                  <span className="text-[10px] tabular-nums text-[#777283]">
                    {currentPage + 1}/{pageCount}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= pageCount - 1}
                    className="rounded border px-2 py-1 text-xs disabled:opacity-40"
                    aria-label="Next preview page"
                    onClick={() =>
                      selectedTrackRef.current?.scrollBy({
                        left: selectedTrackRef.current.clientWidth * 0.82,
                        behavior: 'smooth',
                      })
                    }
                  >
                    &#8250;
                  </button>
                </div>
              </div>
              <div
                ref={selectedTrackRef}
                className="grid auto-cols-[40%] grid-flow-col gap-2 overflow-x-auto snap-x snap-mandatory pb-1"
                onScroll={(event) => {
                  const track = event.currentTarget;
                  const step = track.clientWidth * 0.82 + 8;
                  setSelectedPage(Math.min(pageCount - 1, Math.round(track.scrollLeft / step)));
                }}
              >
                {latestPages.map((pageItems, pageIndex) => (
                  <div
                    key={'page-' + pageIndex}
                    className="grid min-w-0 grid-rows-2 gap-2 snap-start"
                  >
                    {pageItems.map((item, index) => {
                      const itemIndex = pageIndex * 2 + index;
                      return (
                        <div
                          key={item.type + '-' + item.id}
                          className="group relative h-[118px] min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm sm:h-[132px]"
                        >
                          <OptionPreview
                            item={item}
                            className="absolute inset-0 h-full w-full bg-slate-100 object-contain"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
                          <span className="absolute bottom-2 left-2 right-20 z-10">
                            <small className="block text-[8px] font-bold uppercase tracking-wider text-white/75">
                              {item.type}
                            </small>
                            <span
                              className="block truncate text-xs font-semibold text-white"
                              title={item.title}
                            >
                              {item.title}
                            </span>
                          </span>
                          <div className="absolute right-1.5 top-1.5 z-10 flex items-center gap-0.5 rounded-md bg-white/95 p-0.5 shadow-sm">
                            <button
                              type="button"
                              className="rounded px-1 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                              disabled={itemIndex === 0}
                              onClick={() => moveLatest(itemIndex, -1)}
                              aria-label="Move item earlier"
                            >
                              &#8593;
                            </button>
                            <button
                              type="button"
                              className="rounded px-1 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                              disabled={itemIndex === latestItems.length - 1}
                              onClick={() => moveLatest(itemIndex, 1)}
                              aria-label="Move item later"
                            >
                              &#8595;
                            </button>
                            <button
                              type="button"
                              className="rounded px-1 text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                              onClick={() => removeLatest(item.id)}
                              aria-label="Remove item"
                            >
                              &#215;
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                {!latestItems.length && (
                  <p className="rounded border border-dashed border-[#d8cfdc] p-4 text-center text-xs text-[#777283]">
                    Add articles or videos below to fill the carousel.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded border border-[#ebe8ef] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold">Content Studio library</h3>
                  <p className="mt-1 text-[10px] text-[#777283]">
                    Add published articles or videos. Two appear per slide.
                  </p>
                </div>
                <div className="flex gap-1">
                  {(['ALL', 'ARTICLE', 'VIDEO', 'EVENT'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilter(type)}
                      className={`rounded px-2 py-1 text-[9px] font-bold ${filter === type ? 'bg-[#1e1b4b] text-white' : 'bg-[#f4f2f6] text-[#777283]'}`}
                    >
                      {type === 'ALL' ? 'All' : type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid max-h-[350px] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                {availableItems.map((item) => {
                  const added = value.contentIds.includes(item.id);
                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex min-w-0 items-center gap-2 rounded border border-[#ebe8ef] p-2"
                    >
                      <OptionPreview
                        item={item}
                        className="h-12 w-16 shrink-0 rounded bg-[#eeeaf1] object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <small className="block text-[8px] font-black uppercase text-[#d92867]">
                          {item.type}
                        </small>
                        <span className="line-clamp-2 block text-[10px] font-semibold">
                          {item.title}
                        </span>
                      </span>
                      <button
                        type="button"
                        className="shrink-0 rounded bg-[#fff0f5] px-2 py-1 text-[9px] font-bold text-[#d92867] disabled:opacity-50"
                        disabled={added || latestIds.length >= MAX_LATEST_ITEMS}
                        onClick={() => addLatest(item.id)}
                      >
                        {added ? 'Added' : 'Add'}
                      </button>
                    </div>
                  );
                })}
                {!availableItems.length && (
                  <p className="p-3 text-[11px] text-[#777283]">
                    Publish content in Content Studio first.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-[#ebe8ef] pt-4">
          <button className="rounded border px-4 py-2 text-xs" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="rounded bg-[#d92867] px-4 py-2 text-xs font-bold text-white"
            disabled={busy}
          >
            {busy ? 'Saving...' : 'Save hero section'}
          </button>
        </div>
      </form>
    </div>
  );
}
