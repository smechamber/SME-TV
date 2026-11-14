import type { Stats } from '../types';
import { ContentEditor } from './ContentEditor';
import type { AdminWorkspaceProps } from './AdminWorkspace';

const statLabels: [keyof Stats, string][] = [
  ['publishedArticles', 'Published articles'],
  ['drafts', 'Draft articles'],
  ['videos', 'Published videos'],
  ['upcomingEvents', 'Upcoming events'],
  ['users', 'Registered users'],
];

export default function OverviewPage(props: AdminWorkspaceProps) {
  return (
    <div className="mx-auto max-w-[1200px] p-[22px] md:p-[34px]" id="overview">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">
            NEWSROOM OVERVIEW
          </p>
          <h1 className="text-[27px] font-bold tracking-[-.04em]">Good day, Admin</h1>
          <p className="mt-2 text-[13px] text-[#777283]">
            Manage the stories and events reaching your community.
          </p>
        </div>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="rounded border border-[#dedbe3] bg-white px-3 py-2 text-[11px] font-bold"
        >
          View website
        </a>
      </div>
      {props.notice && (
        <div className="my-4 rounded bg-[#edf7f2] px-4 py-3 text-[13px] text-[#24724f]">
          {props.notice}
        </div>
      )}
      <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-[13px]">
        {statLabels.map(([key, label]) => (
          <div
            className="grid gap-2 rounded border border-[#ebe8ef] bg-white p-4 md:p-[17px_18px]"
            key={key}
          >
            <span className="text-[11px] font-bold text-[#777283]">{label}</span>
            <strong className="text-[28px] tracking-[-.04em]">{props.stats[key]}</strong>
            <small className="text-[10px] text-[#aaa5b1]">Shared platform data</small>
          </div>
        ))}
      </div>
      <ContentEditor {...props} />
    </div>
  );
}

const inputClass =
  'w-full rounded border border-[#dedbe3] bg-white p-3 text-[13px] font-normal text-[#282338] outline-none focus:border-[#a35a83] focus:ring-4 focus:ring-[#d9286714]';
