import { useMemo, useState } from 'react';
import type { Design, Option, Section } from './types';
import { designs, inputClass } from './config';

export default function SectionForm({
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
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const allOptions = useMemo(
    () =>
      (Object.entries(options) as ['ARTICLE' | 'VIDEO' | 'EVENT', Option[]][]).flatMap(
        ([type, items]) => items.map((item) => ({ ...item, type })),
      ),
    [options],
  );
  const selected = value.contentIds
    .map((id) => allOptions.find((item) => item.id === id))
    .filter((item): item is Option => Boolean(item));
  const update = (patch: Partial<Section>) => setValue((current) => ({ ...current, ...patch }));
  const addContent = (id: string, at?: number) => {
    if (value.contentIds.includes(id)) return;
    const next = [...value.contentIds];
    next.splice(at ?? next.length, 0, id);
    update({
      contentIds: next,
      itemCount: Math.max(value.itemCount, next.length),
      contentType: 'MIXED',
    });
  };
  const removeContent = (id: string) =>
    update({ contentIds: value.contentIds.filter((item) => item !== id) });
  const moveContent = (index: number, direction: -1 | 1) => {
    const next = [...value.contentIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ contentIds: next });
  };
  const dropContent = (index?: number) => {
    if (draggedId) addContent(draggedId, index);
    setDraggedId(null);
  };
  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-[#221b30aa] p-4">
      <form
        className="mx-auto my-6 max-h-[calc(100vh-3rem)] w-full max-w-[1180px] overflow-auto rounded-lg bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(value);
        }}
      >
        <div className="flex items-center justify-between border-b border-[#ebe8ef] pb-3">
          <div>
            <h2 className="text-lg font-bold">
              {value.id ? 'Edit homepage section' : 'Add homepage section'}
            </h2>
            <p className="mt-1 text-[11px] text-[#777283]">
              Drag any combination of articles, videos, and events into the section.
            </p>
          </div>
          <button type="button" onClick={onCancel}>
            ×
          </button>
        </div>
        <label className="mt-4 grid max-w-xl gap-1 text-xs font-bold">
          Section name
          <input
            className={inputClass}
            value={value.name}
            onChange={(event) => update({ name: event.target.value })}
            required
          />
        </label>
        <div className="mt-5">
          <span className="text-xs font-bold">Design preset</span>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {designs.map((design) => (
              <button
                className={`min-w-[155px] rounded border p-3 text-left ${value.design === design.value ? 'border-[#d92867] bg-[#fff5f8]' : 'border-[#ebe8ef]'}`}
                key={design.value}
                type="button"
                onClick={() => update({ design: design.value })}
              >
                <DesignSwatch design={design.value} />
                <strong className="mt-2 block text-xs">{design.label}</strong>
                <small className="mt-1 block text-[10px] font-normal text-[#777283]">
                  {design.hint}
                </small>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold">Content library</p>
              <span className="text-[10px] text-[#777283]">Drag to add</span>
            </div>
            <div className="grid max-h-[430px] grid-cols-2 gap-2 overflow-y-auto rounded border border-[#ebe8ef] bg-[#faf9fb] p-2">
              {allOptions.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  draggable
                  onDragStart={() => setDraggedId(item.id)}
                  className="overflow-hidden rounded border border-[#ebe8ef] bg-white shadow-sm hover:border-[#d92867]"
                >
                  <div
                    className="h-16 bg-[#eeeaf1] bg-cover bg-center"
                    style={
                      optionImage(item)
                        ? { backgroundImage: `url('${optionImage(item)}')` }
                        : undefined
                    }
                  />
                  <div className="p-2">
                    <div className="mb-1 flex items-center justify-between gap-1">
                      <span className="rounded bg-[#fff0f5] px-1 py-0.5 text-[8px] font-bold text-[#d92867]">
                        {item.type}
                      </span>
                      <button
                        type="button"
                        className="text-[10px] font-bold text-[#d92867]"
                        onClick={() => addContent(item.id)}
                      >
                        Add
                      </button>
                    </div>
                    <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-[#282338]">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
              {!allOptions.length && (
                <p className="col-span-2 p-3 text-[11px] text-[#777283]">
                  Publish content in Content Studio first.
                </p>
              )}
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold">Section content preview</p>
              <span className="text-[10px] text-[#777283]">{selected.length} selected</span>
            </div>
            <div
              className="rounded border-2 border-dashed border-[#d8cfdc] bg-[#fcfbfd] p-3"
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => dropContent()}
            >
              <PreviewLayout
                design={value.design}
                items={selected}
                onRemove={removeContent}
                onMove={moveContent}
                onDrop={dropContent}
              />
              {!selected.length && (
                <div className="mt-3 flex min-h-[80px] items-center justify-center text-center text-xs text-[#777283]">
                  Drop content here to preview this preset
                </div>
              )}
            </div>
            <p className="mt-2 text-[10px] text-[#777283]">
              This wireframe matches the selected homepage preset. Items appear in this order on the
              website.
            </p>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(event) => update({ enabled: event.target.checked })}
          />{' '}
          Enabled on website
        </label>
        <div className="mt-5 flex justify-end gap-2 border-t border-[#ebe8ef] pt-4">
          <button className="rounded border px-4 py-2 text-xs" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="rounded bg-[#d92867] px-4 py-2 text-xs font-bold text-white"
            disabled={busy}
          >
            {busy ? 'Saving...' : 'Save section'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function optionImage(item: Option) {
  return item.imageUrl ?? item.thumbnail;
}

export function PreviewLayout({
  design,
  items,
  onRemove,
  onMove,
  onDrop,
}: {
  design: Design;
  items: Option[];
  onRemove: (id: string) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onDrop: (index?: number) => void;
}) {
  const slotCount =
    design === 'SPLIT_FEATURED' || design === 'FEATURED_GRID'
      ? 4
      : design === 'COMPACT_LIST'
        ? 4
        : design === 'DARK_BAND' || design === 'EVENT_CARDS'
          ? 3
          : 6;
  const slots =
    design === 'SPLIT_FEATURED'
      ? ['lg:row-span-3', '', '', '']
      : design === 'FEATURED_GRID'
        ? ['lg:row-span-2', '', '', '']
        : design === 'COMPACT_LIST'
          ? ['', '', '', '']
          : ['', '', '', ''];
  const visible = items.slice(0, slotCount);
  const columns =
    design === 'SPLIT_FEATURED' || design === 'FEATURED_GRID'
      ? 'grid-cols-2'
      : design === 'COMPACT_LIST'
        ? 'grid-cols-1'
        : 'grid-cols-3';
  return (
    <div className={`grid ${columns} gap-2`}>
      {visible.map((item, index) => (
        <div
          key={`${item.type}-${item.id}`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => onDrop(index)}
          className={`group relative min-h-[72px] overflow-hidden rounded border border-[#e5dfe8] bg-white ${slots[index] ?? ''}`}
        >
          <div
            className={`${index === 0 && (design === 'SPLIT_FEATURED' || design === 'FEATURED_GRID') ? 'h-28' : 'h-14'} bg-[#eeeaf1] bg-cover bg-center`}
            style={
              optionImage(item) ? { backgroundImage: `url('${optionImage(item)}')` } : undefined
            }
          />
          <div className="p-1.5">
            <span className="text-[7px] font-black uppercase tracking-wider text-[#d92867]">
              {item.type}
            </span>
            <p className="line-clamp-2 text-[9px] font-bold leading-tight text-[#282338]">
              {item.title}
            </p>
          </div>
          <div className="absolute right-1 top-1 hidden gap-0.5 rounded bg-white/90 p-0.5 shadow group-hover:flex">
            <button
              type="button"
              className="px-1 text-[9px]"
              disabled={index === 0}
              onClick={() => onMove(index, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              className="px-1 text-[9px]"
              disabled={index === visible.length - 1}
              onClick={() => onMove(index, 1)}
            >
              ↓
            </button>
            <button
              type="button"
              className="px-1 text-[10px] text-[#d92867]"
              onClick={() => onRemove(item.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
      {Array.from({ length: Math.max(0, slotCount - visible.length) }).map((_, index) => (
        <div
          key={`empty-${index}`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => onDrop(visible.length + index)}
          className={`min-h-[72px] rounded border border-dashed border-[#d8cfdc] bg-[#f7f4f8] ${slots[visible.length + index] ?? ''}`}
        />
      ))}
    </div>
  );
}

export function DesignSwatch({ design }: { design: Design }) {
  if (design === 'SPLIT_FEATURED')
    return (
      <div className="builder-swatch builder-swatch-split">
        <span />
        <i />
        <i />
        <i />
      </div>
    );
  if (design === 'DARK_BAND')
    return (
      <div className="builder-swatch builder-swatch-dark">
        <i />
        <i />
        <i />
      </div>
    );
  if (design === 'COMPACT_LIST')
    return (
      <div className="builder-swatch builder-swatch-list">
        <b>01</b>
        <i />
        <b>02</b>
        <i />
        <b>03</b>
        <i />
      </div>
    );
  if (design === 'EVENT_CARDS')
    return (
      <div className="builder-swatch builder-swatch-events">
        <i />
        <i />
        <i />
      </div>
    );
  if (design === 'FEATURED_GRID')
    return (
      <div className="builder-swatch builder-swatch-grid">
        <span />
        <i />
        <i />
        <i />
      </div>
    );
  return (
    <div className="builder-swatch builder-swatch-standard">
      <i />
      <i />
      <i />
    </div>
  );
}
