'use client';

import { useEffect, useState } from 'react';
import type { Option, Section } from './homepage-builder/types';
import { emptySection, designs } from './homepage-builder/config';
import SectionForm from './homepage-builder/SectionEditor';
import HeroSectionEditor from './HeroSectionEditor';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function emptyHeroSection(): Section {
  return {
    ...emptySection(0),
    name: 'Hero + Latest',
    kind: 'HERO',
    layout: 'HERO',
    design: 'SPLIT_FEATURED',
    source: 'MANUAL',
    contentType: 'MIXED',
    itemCount: 302,
    displayOrder: 0,
    enabled: true,
  };
}

function emptyTrendingSection(): Section {
  return {
    ...emptySection(1),
    name: 'Trending on SMETV',
    kind: 'TRENDING',
    layout: 'GRID',
    design: 'STANDARD',
    source: 'MANUAL',
    contentType: 'MIXED',
    itemCount: 6,
    displayOrder: 1,
    enabled: false,
  };
}

export default function HomepageBuilder({
  token,
  onNotice,
}: {
  token: string;
  onNotice: (message: string) => void;
}) {
  const [sections, setSections] = useState<Section[]>([]);
  const [options, setOptions] = useState<Record<'ARTICLE' | 'VIDEO' | 'EVENT', Option[]>>({
    ARTICLE: [],
    VIDEO: [],
    EVENT: [],
  });
  const [editing, setEditing] = useState<Section | null>(null);
  const [editingHero, setEditingHero] = useState(false);
  const [editingTrending, setEditingTrending] = useState(false);
  const [busy, setBusy] = useState(false);
  const heroSection = sections.find((section) => section.kind === 'HERO') ?? emptyHeroSection();
  const trendingSection =
    sections.find((section) => section.kind === 'TRENDING') ?? emptyTrendingSection();
  const orderedSections = [
    ...sections.filter((section) => section.kind !== 'HERO'),
    ...(sections.some((section) => section.kind === 'TRENDING') ? [] : [trendingSection]),
  ]
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const regularSections = orderedSections.filter((section) => section.kind !== 'TRENDING');
  const heroMarkerIndex = heroSection.contentIds.indexOf('__HERO_LATEST__');
  const heroVideoSelected = options.VIDEO.some(
    (video) => video.id === heroSection.contentIds[0] && heroSection.contentIds[0] !== '__HERO_LATEST__',
  );
  const heroLatestCount = Math.max(
    0,
    heroSection.contentIds.length - (heroMarkerIndex >= 0 ? heroMarkerIndex + 1 : 1),
  );

  async function load() {
    const headers = { Authorization: `Bearer ${token}` };
    const [sectionResponse, contentResponse] = await Promise.all([
      fetch(`${API}/api/admin/homepage`, { headers }),
      fetch(`${API}/api/admin/homepage/content`, { headers }),
    ]);
    if (!sectionResponse.ok || !contentResponse.ok)
      throw new Error('Unable to load homepage configuration');
    const loadedSections = ((await sectionResponse.json()) as { data: Section[] }).data;
    setSections(loadedSections);
    setOptions(
      ((await contentResponse.json()) as { data: Record<'ARTICLE' | 'VIDEO' | 'EVENT', Option[]> })
        .data,
    );
  }

  useEffect(() => {
    void load().catch((error) =>
      onNotice(error instanceof Error ? error.message : 'Unable to load homepage configuration'),
    );
  }, [token]);

  async function save(section: Section) {
    setBusy(true);
    try {
      const isNew = !section.id;
      const normalized =
        section.kind === 'HERO'
          ? {
              ...section,
              name: 'Hero + Latest',
              kind: 'HERO',
              layout: 'HERO',
              design: 'SPLIT_FEATURED',
              source: 'MANUAL',
              contentType: 'MIXED',
              itemCount: 302,
              displayOrder: 0,
              enabled: true,
            }
          : section.kind === 'TRENDING'
            ? {
                ...section,
                name: 'Trending on SMETV',
                kind: 'TRENDING' as const,
                layout: 'GRID' as const,
                design: 'STANDARD' as const,
                contentType: 'MIXED' as const,
                displayOrder: Math.max(1, section.displayOrder),
              }
          : section;
      const { id: _id, ...body } = normalized;
      const response = await fetch(`${API}/api/admin/homepage${isNew ? '' : `/${section.id}`}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as { data?: Section; message?: string };
      if (!response.ok || !payload.data)
        throw new Error(payload.message ?? 'Unable to save homepage section');
      setEditing(null);
      setEditingHero(false);
      setEditingTrending(false);
      onNotice('Homepage configuration saved. Changes are live on the website.');
      await load();
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Unable to save homepage section');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this homepage section?')) return;
    const response = await fetch(`${API}/api/admin/homepage/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      onNotice('Unable to delete homepage section');
      return;
    }
    onNotice('Homepage section deleted.');
    await load();
  }

  async function toggle(section: Section) {
    await save({ ...section, enabled: !section.enabled });
  }

  async function move(section: Section, direction: -1 | 1) {
    const index = orderedSections.findIndex((item) => item.id === section.id);
    const target = orderedSections[index + direction];
    if (!target) return;
    await Promise.all([
      save({ ...section, displayOrder: target.displayOrder }),
      save({ ...target, displayOrder: section.displayOrder }),
    ]);
  }

  return (
    <div className="mx-auto max-w-[1200px] p-[22px] md:p-[34px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">
            PUBLISHING CONTROLS
          </p>
          <h1 className="text-[27px] font-bold tracking-[-.04em]">Homepage builder</h1>
          <p className="mt-2 text-[13px] text-[#777283]">
            Set the fixed hero, then arrange the content sections below it.
          </p>
        </div>
        <button
          className="rounded bg-[#d92867] px-4 py-2 text-xs font-bold text-white"
          onClick={() => setEditing(emptySection(regularSections.length + 1))}
        >
          Add section
        </button>
      </div>

      <div className="mt-6 rounded border-2 border-[#d92867] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#fff0f5] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-[#d92867]">
                Fixed at top
              </span>
              <strong className="text-sm">Hero + Latest</strong>
            </div>
            <p className="mt-2 text-[11px] text-[#777283]">
              Main video: {heroVideoSelected ? 'selected' : 'not selected'}
              {' - '}Latest carousel: {heroLatestCount} items (2 per slide)
              {' - '}This section stays first and cannot be removed.
            </p>
          </div>
          <button
            className="rounded bg-[#1e1b4b] px-4 py-2 text-xs font-bold text-white"
            onClick={() => setEditingHero(true)}
          >
            Edit hero content
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {orderedSections.map((section) => {
          const sectionIndex = orderedSections.findIndex((item) => item.id === section.id);
          const isTrending = section.kind === 'TRENDING';
          return (
            <div
              className={`rounded border bg-white p-4 ${
                section.enabled
                  ? isTrending
                    ? 'border-2 border-[#28206f]'
                    : 'border-[#ebe8ef]'
                  : 'border-dashed border-[#c8c3ce] opacity-60'
              }`}
              key={section.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isTrending && (
                      <span className="rounded bg-[#eeedff] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-[#28206f]">
                        Trending section
                      </span>
                    )}
                    <strong className="text-sm">
                      {isTrending ? 'Trending on SMETV' : section.name}
                    </strong>
                    <span className="rounded bg-[#f4f2f6] px-2 py-1 text-[9px] font-bold uppercase">
                      {section.contentType}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#777283]">
                    {isTrending
                      ? `${section.contentIds.length} selected items - image and text layout`
                      : `${designs.find((item) => item.value === section.design)?.label ?? section.design} - ${section.contentIds.length || section.itemCount} items`}
                    {' - Position '} {sectionIndex + 1} after Hero
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <button
                    disabled={sectionIndex === 0 || busy}
                    onClick={() => void move(section, -1)}
                  >
                    Up
                  </button>
                  <button
                    disabled={sectionIndex === orderedSections.length - 1 || busy}
                    onClick={() => void move(section, 1)}
                  >
                    Down
                  </button>
                  <button onClick={() => void toggle(section)}>
                    {section.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() =>
                      isTrending ? setEditingTrending(true) : setEditing(section)
                    }
                  >
                    {isTrending ? 'Edit trending content' : 'Edit section'}
                  </button>
                  {!isTrending && (
                    <button className="text-[#d92867]" onClick={() => void remove(section.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <SectionForm
          section={editing}
          options={options}
          busy={busy}
          onCancel={() => setEditing(null)}
          onSave={(section) => void save(section)}
        />
      )}
      {editingHero && (
        <HeroSectionEditor
          section={heroSection}
          options={options}
          busy={busy}
          onCancel={() => setEditingHero(false)}
          onSave={(section) => void save(section)}
        />
      )}
      {editingTrending && (
        <SectionForm
          section={trendingSection}
          options={options}
          busy={busy}
          onCancel={() => setEditingTrending(false)}
          onSave={(section) => void save({ ...section, enabled: true })}
        />
      )}
    </div>
  );
}
