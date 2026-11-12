'use client';

import { useEffect, useState } from 'react';
import type { ContentType } from './AdminWorkspace';
import type { ManagedContent } from './content-studio/types';
import ContentCard from './content-studio/ContentCard';

const sections = [
  {
    label: 'Videos',
    eyebrow: 'WATCH & SHARE',
    description:
      'Manage interviews, explainers, highlights and other video stories for your audience.',
    color: 'pink',
    mark: '▶',
    type: 'video',
  },
  {
    label: 'Articles',
    eyebrow: 'READ & INFORM',
    description: 'Create and organise news articles, features and updates from the SME community.',
    color: 'purple',
    mark: 'Aa',
    type: 'news',
  },
  {
    label: 'Posts',
    eyebrow: 'CONNECT & ENGAGE',
    description: 'Share quick updates, announcements and conversations across the platform.',
    color: 'blue',
    mark: '✦',
    type: 'news',
  },
  {
    label: 'Events',
    eyebrow: 'MEET & GROW',
    description: 'Publish upcoming events and keep your community informed about what is next.',
    color: 'orange',
    mark: '◷',
    type: 'event',
  },
] as const;

const accents = {
  pink: { icon: 'bg-[#fdeaf1] text-[#d92867]', glow: 'bg-[#d92867]' },
  purple: { icon: 'bg-[#eee8f3] text-[#542c71]', glow: 'bg-[#542c71]' },
  blue: { icon: 'bg-[#eaf1fb] text-[#3e73c6]', glow: 'bg-[#3e73c6]' },
  orange: { icon: 'bg-[#fff1e4] text-[#d1792b]', glow: 'bg-[#e18b40]' },
};

type ContentStudioPageProps = {
  active: ContentType;
  token: string;
  onOpenForm: (type: ContentType) => void;
  onEdit: (type: ContentType, item: ManagedContent) => void;
  onNotice: (message: string) => void;
};

export default function ContentStudioPage(props: ContentStudioPageProps) {
  const [selected, setSelected] = useState<ContentType | null>(() =>
    props.active === 'event' ? 'event' : null,
  );
  const [items, setItems] = useState<ManagedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventFilter, setEventFilter] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    const path =
      selected === 'video'
        ? '/api/admin/videos'
        : selected === 'event'
          ? '/api/admin/events'
          : '/api/admin/news';
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}${path}`, {
      headers: { Authorization: 'Bearer ' + props.token },
    })
      .then(async (response) => {
        const payload = (await response.json()) as { data?: ManagedContent[]; message?: string };
        if (!response.ok) throw new Error(payload.message ?? 'Unable to load content');
        setItems(payload.data ?? []);
      })
      .catch((error: unknown) =>
        props.onNotice(error instanceof Error ? error.message : 'Unable to load content'),
      )
      .finally(() => setLoading(false));
  }, [props.onNotice, props.token, selected]);

  async function remove(item: ManagedContent) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    const type = selected === 'video' ? 'videos' : selected === 'event' ? 'events' : 'news';
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/admin/${type}/${item.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + props.token },
      },
    );
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      props.onNotice(payload?.message ?? 'Unable to delete content');
      return;
    }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    props.onNotice(
      `${selected === 'video' ? 'Video' : selected === 'event' ? 'Event' : 'Article'} deleted successfully.`,
    );
  }

  if (selected) {
    const label = selected === 'video' ? 'Video' : selected === 'event' ? 'Event' : 'Article';
    const filteredItems =
      selected === 'event'
        ? items
            .filter((item) => {
              const isPast = Boolean(item.startsAt && new Date(item.startsAt).getTime() < Date.now());
              return eventFilter === 'past' ? isPast : !isPast;
            })
            .sort((left, right) => {
              const first = new Date(left.startsAt ?? 0).getTime();
              const second = new Date(right.startsAt ?? 0).getTime();
              return eventFilter === 'past' ? second - first : first - second;
            })
        : items;
    return (
      <div className="mx-auto min-h-[calc(100vh-58px)] max-w-[1200px] p-[22px] md:p-[34px]">
        <button
          className="mb-4 text-xs font-bold text-[#777283] hover:text-[#d92867]"
          onClick={() => setSelected(null)}
          type="button"
        >
          ← Back to Content Studio
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">
              CONTENT STUDIO
            </p>
            <h1 className="text-[27px] font-bold tracking-[-.04em]">{label}s</h1>
            <p className="mt-2 text-[13px] text-[#777283]">
              Manage content already added to your platform.
            </p>
          </div>
          <button
            className="rounded bg-[#d92867] px-4 py-3 text-xs font-bold text-white"
            onClick={() => props.onOpenForm(selected)}
            type="button"
          >
            + Add {label}
          </button>
        </div>
        <div
          className={
            selected === 'event'
              ? 'mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]'
              : 'mt-6'
          }
        >
          <div className="overflow-hidden rounded border border-[#ebe8ef] bg-white">
          {loading ? (
            <p className="p-6 text-xs text-[#777283]">Loading {label.toLowerCase()}s…</p>
          ) : filteredItems.length === 0 ? (
            <p className="p-6 text-xs text-[#777283]">
              No {label.toLowerCase()}s added yet. Use “Add {label}” to create one.
            </p>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <ContentCard
                  item={item}
                  type={selected}
                  key={item.id}
                  onDelete={() => void remove(item)}
                  onEdit={() => props.onEdit(selected, item)}
                />
              ))}
            </div>
          )}
          </div>
          {selected === 'event' && (
          <aside className="h-fit rounded border border-[#ebe8ef] bg-white p-4">
            <h2 className="text-xs font-extrabold text-[#504b5b]">Filter events</h2>
            <label className="mt-3 grid gap-2 text-[11px] font-bold text-[#777283]">
              Show
              <select
                className="w-full rounded border border-[#dedbe3] bg-white p-3 text-xs font-normal text-[#282338]"
                value={eventFilter}
                onChange={(event) => setEventFilter(event.target.value as 'upcoming' | 'past')}
              >
                <option value="upcoming">Upcoming Events</option>
                <option value="past">Past Events</option>
              </select>
            </label>
            <p className="mt-3 text-[10px] leading-5 text-[#777283]">
              Showing {filteredItems.length} {eventFilter} event{filteredItems.length === 1 ? '' : 's'}.
            </p>
          </aside>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-58px)] max-w-[1200px] p-[22px] md:p-[34px]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">
            PUBLISH TO ALL PLATFORMS
          </p>
          <h1 className="text-[27px] font-bold tracking-[-.04em]">Content studio</h1>
          <p className="mt-2 text-[13px] leading-6 text-[#777283]">
            Choose a content format to create, manage and publish for your community.
          </p>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-[#dcece4] bg-[#f4fbf7] px-3 py-2 text-[11px] font-bold text-[#39805c] sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#4ab477]" /> Workspace ready
        </span>
      </div>
      <div className="mt-7 flex items-center gap-3 rounded-lg border border-[#eadfea] bg-gradient-to-r from-white to-[#fcf8fc] p-4 md:p-5">
        <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#f8e6ee] text-2xl font-light text-[#d92867]">
          +
        </span>
        <div>
          <strong className="text-[13px]">What would you like to create?</strong>
          <p className="mt-1 text-[11px] text-[#777283]">
            Click a content type below to open its publishing form.
          </p>
        </div>
      </div>
      <div className="mt-[18px] grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const accent = accents[section.color];
          return (
            <button
              className="relative min-h-[215px] overflow-hidden rounded-lg border border-[#ebe8ef] bg-white p-6 text-left shadow-[0_8px_20px_rgba(56,34,70,.02)] transition hover:-translate-y-0.5 hover:shadow-md"
              key={section.label}
              onClick={() => {
                setSelected(section.type);
              }}
              type="button"
            >
              <div className="relative z-[1] flex items-center justify-between">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl text-[17px] font-extrabold ${accent.icon}`}
                >
                  {section.mark}
                </span>
                <span className="text-[9px] font-extrabold tracking-[.14em] text-[#777283]">
                  {section.eyebrow}
                </span>
              </div>
              <h2 className="relative z-[1] mt-7 text-[22px] font-bold tracking-[-.04em]">
                {section.label}
              </h2>
              <p className="relative z-[1] mt-2 max-w-[340px] text-xs leading-6 text-[#777283]">
                {section.description}
              </p>
              <div className="relative z-[1] mt-5 flex items-center justify-between border-t border-[#ebe8ef] pt-3 text-[10px] font-bold text-[#777283]">
                <span>Create content</span>
                <span className="text-lg text-[#282338]">↗</span>
              </div>
              <span
                className={`absolute -bottom-14 -right-9 h-[150px] w-[150px] rounded-full opacity-[.16] ${accent.glow}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
