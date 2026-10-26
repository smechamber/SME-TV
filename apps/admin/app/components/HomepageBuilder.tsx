'use client';

import { useEffect, useMemo, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type ContentType = 'ARTICLE' | 'VIDEO' | 'EVENT';
type Field = 'IMAGE' | 'CATEGORY' | 'SUMMARY' | 'DATE' | 'META';
type Design = 'STANDARD' | 'FEATURED_GRID' | 'SPLIT_FEATURED' | 'DARK_BAND' | 'COMPACT_LIST' | 'EVENT_CARDS';
type Option = { id: string; title: string; summary?: string; description?: string; imageUrl?: string; thumbnail?: string; publishedAt?: string; startsAt?: string; location?: string; category?: { name?: string } };
type Section = { id: string; name: string; kind: string; layout: string; design: Design; source: string; contentType: ContentType; itemCount: number; contentIds: string[]; displayFields: Field[]; displayOrder: number; enabled: boolean };
const designs: { value: Design; label: string; hint: string }[] = [
  { value: 'STANDARD', label: 'Standard cards', hint: 'Clean three-column cards' },
  { value: 'FEATURED_GRID', label: 'Editorial news grid', hint: 'Large lead story with stacked and full-width cards' },
  { value: 'SPLIT_FEATURED', label: 'Hero + headlines', hint: 'Large image hero beside editor’s picks' },
  { value: 'DARK_BAND', label: 'Featured video band', hint: 'Dark broadcast strip with video cards' },
  { value: 'COMPACT_LIST', label: 'Compact headlines', hint: 'Numbered headlines with small metadata' },
  { value: 'EVENT_CARDS', label: 'Event cards', hint: 'Date and venue focused cards' },
];
const fields: { value: Field; label: string }[] = [
  { value: 'IMAGE', label: 'Image / thumbnail' }, { value: 'CATEGORY', label: 'Category badge' },
  { value: 'SUMMARY', label: 'Summary / description' }, { value: 'DATE', label: 'Published / event date' }, { value: 'META', label: 'Metadata such as venue or location' },
];
const emptySection = (order: number): Section => ({ id: '', name: 'New section', kind: 'CUSTOM', layout: 'GRID', design: 'STANDARD', source: 'MANUAL', contentType: 'ARTICLE', itemCount: 6, contentIds: [], displayFields: ['IMAGE', 'CATEGORY', 'SUMMARY'], displayOrder: order, enabled: true });
const inputClass = 'w-full rounded border border-[#dedbe3] bg-white p-2.5 text-xs text-[#282338]';

export default function HomepageBuilder({ token, onNotice }: { token: string; onNotice: (message: string) => void }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [options, setOptions] = useState<Record<ContentType, Option[]>>({ ARTICLE: [], VIDEO: [], EVENT: [] });
  const [editing, setEditing] = useState<Section | null>(null);
  const [busy, setBusy] = useState(false);
  async function load() {
    const headers = { Authorization: `Bearer ${token}` };
    const [sectionResponse, contentResponse] = await Promise.all([fetch(`${API}/api/admin/homepage`, { headers }), fetch(`${API}/api/admin/homepage/content`, { headers })]);
    if (!sectionResponse.ok || !contentResponse.ok) throw new Error('Unable to load homepage configuration');
    setSections(((await sectionResponse.json()) as { data: Section[] }).data);
    setOptions(((await contentResponse.json()) as { data: Record<ContentType, Option[]> }).data);
  }
  useEffect(() => { void load().catch((error) => onNotice(error instanceof Error ? error.message : 'Unable to load homepage configuration')); }, [token]);
  async function save(section: Section) {
    setBusy(true);
    try {
      const isNew = !section.id;
      const { id: _id, ...body } = section;
      const response = await fetch(`${API}/api/admin/homepage${isNew ? '' : `/${section.id}`}`, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      const payload = (await response.json()) as { data?: Section; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message ?? 'Unable to save homepage section');
      setEditing(null); onNotice('Homepage configuration saved. Changes are live on the website.'); await load();
    } catch (error) { onNotice(error instanceof Error ? error.message : 'Unable to save homepage section'); } finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!window.confirm('Delete this homepage section?')) return;
    const response = await fetch(`${API}/api/admin/homepage/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) { onNotice('Unable to delete homepage section'); return; }
    onNotice('Homepage section deleted.'); await load();
  }
  async function toggle(section: Section) { await save({ ...section, enabled: !section.enabled }); }
  async function move(section: Section, direction: -1 | 1) {
    const index = sections.findIndex((item) => item.id === section.id);
    const target = sections[index + direction];
    if (!target) return;
    await Promise.all([save({ ...section, displayOrder: target.displayOrder }), save({ ...target, displayOrder: section.displayOrder })]);
  }
  return <div className="mx-auto max-w-[1200px] p-[22px] md:p-[34px]">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">PUBLISHING CONTROLS</p><h1 className="text-[27px] font-bold tracking-[-.04em]">Homepage builder</h1><p className="mt-2 text-[13px] text-[#777283]">Choose a design, select content, arrange it, and preview the live section before saving.</p></div><button className="rounded bg-[#d92867] px-4 py-2 text-xs font-bold text-white" onClick={() => setEditing(emptySection(sections.length))}>Add section</button></div>
    <div className="mt-6 grid gap-3">{sections.map((section, index) => <div className={`rounded border bg-white p-4 ${section.enabled ? 'border-[#ebe8ef]' : 'border-dashed border-[#c8c3ce] opacity-60'}`} key={section.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{section.name}</strong><span className="rounded bg-[#f4f2f6] px-2 py-1 text-[9px] font-bold uppercase">{section.kind}</span><span className="rounded bg-[#f4fbf7] px-2 py-1 text-[9px] font-bold uppercase text-[#39805c]">{section.source}</span></div><p className="mt-1 text-[11px] text-[#777283]">{designs.find((item) => item.value === section.design)?.label ?? section.design} · {section.contentType} · {section.contentIds.length || section.itemCount} items</p></div><div className="flex gap-2 text-[11px]"><button disabled={index === 0 || busy} onClick={() => void move(section, -1)}>↑</button><button disabled={index === sections.length - 1 || busy} onClick={() => void move(section, 1)}>↓</button><button onClick={() => void toggle(section)}>{section.enabled ? 'Disable' : 'Enable'}</button><button onClick={() => setEditing(section)}>Edit & preview</button><button className="text-[#d92867]" onClick={() => void remove(section.id)}>Delete</button></div></div></div>)}</div>
    {editing && <SectionForm section={editing} options={options} busy={busy} onCancel={() => setEditing(null)} onSave={(section) => void save(section)} />}
  </div>;
}

function SectionForm({ section, options, busy, onCancel, onSave }: { section: Section; options: Record<ContentType, Option[]>; busy: boolean; onCancel: () => void; onSave: (section: Section) => void }) {
  const [value, setValue] = useState(section);
  const available = options[value.contentType] ?? [];
  const selected = value.contentIds.map((id) => available.find((item) => item.id === id)).filter((item): item is Option => Boolean(item));
  const update = (patch: Partial<Section>) => setValue((current) => ({ ...current, ...patch }));
  const toggleContent = (id: string) => update({ contentIds: value.contentIds.includes(id) ? value.contentIds.filter((item) => item !== id) : [...value.contentIds, id] });
  const moveContent = (index: number, direction: -1 | 1) => { const next = [...value.contentIds]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; update({ contentIds: next }); };
  return <div className="fixed inset-0 z-20 overflow-y-auto bg-[#221b30aa] p-4"><form className="mx-auto my-6 max-h-[calc(100vh-3rem)] w-full max-w-[1100px] overflow-auto rounded-lg bg-white p-5" onSubmit={(event) => { event.preventDefault(); onSave(value); }}><div className="flex items-center justify-between border-b border-[#ebe8ef] pb-3"><div><h2 className="text-lg font-bold">{value.id ? 'Edit homepage section' : 'Add homepage section'}</h2><p className="mt-1 text-[11px] text-[#777283]">The preview updates as you change the design and selected content.</p></div><button type="button" onClick={onCancel}>×</button></div><div className="grid gap-5 pt-4 lg:grid-cols-[1fr_390px]"><div><label className="grid gap-1 text-xs font-bold">Section name<input className={inputClass} value={value.name} onChange={(event) => update({ name: event.target.value })} required /></label><div className="mt-3 grid gap-3 sm:grid-cols-2"><Select label="Section type" value={value.kind} options={['HERO', 'TRENDING', 'LATEST', 'INTERVIEWS', 'NEWS', 'VIDEOS', 'EVENTS', 'CUSTOM']} onChange={(kind) => update({ kind })} /><Select label="Layout" value={value.layout} options={['HERO', 'GRID', 'LIST', 'CAROUSEL']} onChange={(layout) => update({ layout })} /><Select label="Content type" value={value.contentType} options={['ARTICLE', 'VIDEO', 'EVENT']} onChange={(contentType) => update({ contentType: contentType as ContentType, contentIds: [] })} /><Select label="Content source" value={value.source} options={['MANUAL', 'LATEST', 'TRENDING']} onChange={(source) => update({ source, contentIds: [] })} /><label className="grid gap-1 text-xs font-bold">Number of items<input className={inputClass} type="number" min="1" max="24" value={value.itemCount} onChange={(event) => update({ itemCount: Number(event.target.value) })} /></label><label className="grid gap-1 text-xs font-bold">Display order<input className={inputClass} type="number" min="0" value={value.displayOrder} onChange={(event) => update({ displayOrder: Number(event.target.value) })} /></label></div><div className="mt-4"><span className="text-xs font-bold">Design preset</span><div className="mt-2 grid gap-2 sm:grid-cols-2">{designs.map((design) => <button className={`rounded border p-3 text-left ${value.design === design.value ? 'border-[#d92867] bg-[#fff5f8]' : 'border-[#ebe8ef]'}`} key={design.value} type="button" onClick={() => update({ design: design.value })}>  <DesignSwatch design={design.value} /><strong className="mt-2 block text-xs">{design.label}</strong><small className="mt-1 block text-[10px] font-normal text-[#777283]">{design.hint}</small></button>)}</div></div><div className="mt-4"><span className="text-xs font-bold">Show in each card</span><div className="mt-2 flex flex-wrap gap-2">{fields.map((field) => <label className="rounded border px-2 py-1.5 text-[10px] font-normal" key={field.value}><input className="mr-1" type="checkbox" checked={value.displayFields.includes(field.value)} onChange={() => update({ displayFields: value.displayFields.includes(field.value) ? value.displayFields.filter((item) => item !== field.value) : [...value.displayFields, field.value] })} />{field.label}</label>)}</div></div>{value.source === 'MANUAL' && <div className="mt-4"><p className="text-xs font-bold">Select and arrange content</p><div className="mt-2 grid gap-2 rounded border border-[#ebe8ef] p-2">{available.map((item) => <div className={`flex items-center gap-2 rounded p-2 text-xs ${value.contentIds.includes(item.id) ? 'bg-[#fff5f8]' : 'bg-[#faf9fb]'}`} key={item.id}><input type="checkbox" checked={value.contentIds.includes(item.id)} onChange={() => toggleContent(item.id)} /><span className="min-w-0 flex-1 truncate">{item.title}</span>{value.contentIds.includes(item.id) && <span className="flex gap-1"><button type="button" disabled={value.contentIds.indexOf(item.id) === 0} onClick={() => moveContent(value.contentIds.indexOf(item.id), -1)}>↑</button><button type="button" disabled={value.contentIds.indexOf(item.id) === value.contentIds.length - 1} onClick={() => moveContent(value.contentIds.indexOf(item.id), 1)}>↓</button></span>}</div>)}{!available.length && <p className="p-3 text-[11px] text-[#777283]">No published {value.contentType.toLowerCase()} content available. Publish it in Content Studio first.</p>}</div><p className="mt-1 text-[10px] font-normal text-[#777283]">The selected order is the website display order.</p></div>}<label className="mt-4 flex items-center gap-2 text-xs"><input type="checkbox" checked={value.enabled} onChange={(event) => update({ enabled: event.target.checked })} /> Enabled on website</label></div><Preview section={value} selected={selected} /></div><div className="mt-5 flex justify-end gap-2 border-t border-[#ebe8ef] pt-4"><button className="rounded border px-4 py-2 text-xs" type="button" onClick={onCancel}>Cancel</button><button className="rounded bg-[#d92867] px-4 py-2 text-xs font-bold text-white" disabled={busy}>{busy ? 'Saving...' : 'Save section'}</button></div></form></div>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="grid gap-1 text-xs font-bold">{label}<select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((item) => <option key={item}>{item}</option>)}</select></label>; }
function DesignSwatch({ design }: { design: Design }) {
  if (design === 'SPLIT_FEATURED') return <div className="builder-swatch builder-swatch-split"><span /><i /><i /><i /></div>;
  if (design === 'DARK_BAND') return <div className="builder-swatch builder-swatch-dark"><i /><i /><i /></div>;
  if (design === 'COMPACT_LIST') return <div className="builder-swatch builder-swatch-list"><b>01</b><i /><b>02</b><i /><b>03</b><i /></div>;
  if (design === 'EVENT_CARDS') return <div className="builder-swatch builder-swatch-events"><i /><i /><i /></div>;
  if (design === 'FEATURED_GRID') return <div className="builder-swatch builder-swatch-grid"><span /><i /><i /><i /></div>;
  return <div className="builder-swatch builder-swatch-standard"><i /><i /><i /></div>;
}
function Preview({ section, selected }: { section: Section; selected: Option[] }) {
  const items = selected.length ? selected : [{ id: 'preview', title: 'Your selected content will appear here', summary: 'Choose published content to see the section preview.' }];
  const isDark = section.design === 'DARK_BAND';
  return <aside className={`rounded border p-4 ${isDark ? 'bg-[#211b2d] text-white' : 'bg-[#faf9fb] text-[#282338]'}`}><div className="mb-3 flex items-center justify-between"><div><p className="text-[9px] font-extrabold tracking-[.14em] text-[#d92867]">LIVE PREVIEW</p><h3 className="mt-1 text-base font-bold">{section.name || 'Homepage section'}</h3></div><span className="text-[9px] uppercase opacity-60">{section.design.replace('_', ' ')}</span></div><div className={`grid gap-2 ${section.design === 'COMPACT_LIST' ? '' : 'sm:grid-cols-2'}`}>{items.slice(0, section.itemCount).map((item, index) => <div className={`rounded border p-2 ${index === 0 && section.design === 'SPLIT_FEATURED' ? 'sm:row-span-2' : ''} ${isDark ? 'border-white/10 bg-white/10' : 'border-[#ebe8ef] bg-white'}`} key={item.id}><div className="mb-2 h-16 rounded bg-gradient-to-br from-[#542c71] to-[#d92867]">{section.displayFields.includes('IMAGE') && (item.imageUrl || item.thumbnail) && <img className="h-full w-full rounded object-cover" src={item.imageUrl || item.thumbnail} alt="" />}</div><strong className="block line-clamp-2 text-[11px]">{item.title}</strong>{section.displayFields.includes('CATEGORY') && item.category?.name && <small className="mt-1 block text-[9px] text-[#d92867]">{item.category.name}</small>}{section.displayFields.includes('SUMMARY') && <p className="mt-1 line-clamp-2 text-[9px] opacity-70">{item.summary || item.description}</p>}{section.displayFields.includes('META') && <small className="mt-1 block text-[9px] opacity-70">{item.location || 'Content metadata'}</small>}</div>)}</div></aside>;
}
