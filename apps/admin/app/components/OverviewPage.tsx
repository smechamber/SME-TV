import type { FormEvent } from 'react';
import RichTextEditor from '../RichTextEditor';
import MediaUpload from '../MediaUpload';
import type { Registration, Stats } from '../types';
import type { AdminWorkspaceProps, ContentType } from './AdminWorkspace';

const statLabels: [keyof Stats, string][] = [
  ['publishedArticles', 'Published articles'], ['drafts', 'Draft articles'], ['videos', 'Published videos'],
  ['upcomingEvents', 'Upcoming events'], ['registrations', 'Event registrations'], ['users', 'Registered users'],
];

export default function OverviewPage(props: AdminWorkspaceProps) {
  return (
    <div className="mx-auto max-w-[1200px] p-[22px] md:p-[34px]" id="overview">
      <div className="flex items-center justify-between gap-4">
        <div><p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">NEWSROOM OVERVIEW</p><h1 className="text-[27px] font-bold tracking-[-.04em]">Good day, Admin</h1><p className="mt-2 text-[13px] text-[#777283]">Manage the stories and events reaching your community.</p></div>
        <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="rounded border border-[#dedbe3] bg-white px-3 py-2 text-[11px] font-bold">View website</a>
      </div>
      {props.notice && <div className="my-4 rounded bg-[#edf7f2] px-4 py-3 text-[13px] text-[#24724f]">{props.notice}</div>}
      <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-[13px]">
        {statLabels.map(([key, label]) => <div className="grid gap-2 rounded border border-[#ebe8ef] bg-white p-4 md:p-[17px_18px]" key={key}><span className="text-[11px] font-bold text-[#777283]">{label}</span><strong className="text-[28px] tracking-[-.04em]">{props.stats[key]}</strong><small className="text-[10px] text-[#aaa5b1]">Shared platform data</small></div>)}
      </div>
      <RegistrationsPanel registrations={props.registrations} />
      <ContentEditor {...props} />
    </div>
  );
}

function RegistrationsPanel({ registrations }: { registrations: Registration[] }) {
  return <section className="mt-[22px] rounded border border-[#ebe8ef] bg-white p-4 md:p-[22px]" id="registrations">
    <div className="border-b border-[#ebe8ef] pb-4"><p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">COMMUNITY</p><h2 className="text-[19px] font-bold tracking-[-.03em]">Recent event registrations</h2></div>
    {registrations.length ? <div className="overflow-auto"><table className="w-full border-collapse text-left text-[11px]"><thead><tr>{['Attendee', 'Company', 'Event', 'Contact', 'Received'].map((heading) => <th className="whitespace-nowrap border-b border-[#ebe8ef] px-2 py-3 font-bold text-[#777283]" key={heading}>{heading}</th>)}</tr></thead><tbody>{registrations.map((item) => <tr key={item.id}><td className="whitespace-nowrap border-b border-[#ebe8ef] px-2 py-3">{item.name}</td><td className="whitespace-nowrap border-b border-[#ebe8ef] px-2 py-3">{item.companyName}</td><td className="whitespace-nowrap border-b border-[#ebe8ef] px-2 py-3">{item.event.title}</td><td className="whitespace-nowrap border-b border-[#ebe8ef] px-2 py-3">{item.email}<br />{item.mobile}</td><td className="whitespace-nowrap border-b border-[#ebe8ef] px-2 py-3">{new Date(item.createdAt).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div> : <p className="pt-4 text-xs text-[#777283]">No event registrations have been submitted yet.</p>}
  </section>;
}

export type ContentEditorProps = Pick<AdminWorkspaceProps, 'token' | 'busy' | 'active' | 'imageUrl' | 'videoUrl' | 'onActiveChange' | 'onImageChange' | 'onVideoChange' | 'onPublish' | 'onArticleContentChange'> & {
  showTabs?: boolean;
};

function Field({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <label className={`mt-[18px] grid gap-2 text-xs font-bold text-[#504b5b] ${className}`}>{children}</label>;
}

const inputClass = 'w-full rounded border border-[#dedbe3] bg-white p-3 text-[13px] font-normal text-[#282338] outline-none focus:border-[#a35a83] focus:ring-4 focus:ring-[#d9286714]';

export function ContentEditor({ token, busy, active, imageUrl, videoUrl, onActiveChange, onImageChange, onVideoChange, onPublish, onArticleContentChange, showTabs = true }: ContentEditorProps) {
  return <section className="mt-[22px] rounded border border-[#ebe8ef] bg-white p-4 md:p-6" id="editor">
    <div className="flex flex-col justify-between gap-4 border-b border-[#ebe8ef] pb-5 md:flex-row md:items-center"><div><p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">PUBLISH TO ALL PLATFORMS</p><h2 className="text-[19px] font-bold tracking-[-.03em]">Create {active === 'news' ? 'article' : active === 'video' ? 'video' : 'event'}</h2><p className="mt-1 text-[11px] text-[#777283]">Published items are saved to the shared database and API.</p></div>{showTabs && <div className="flex w-max rounded bg-[#f4f2f6] p-1">{(['news', 'video', 'event'] as const).map((tab) => <button className={`rounded px-3 py-2 text-[11px] ${active === tab ? 'bg-white text-[#d92867] shadow-sm' : 'text-[#777283]'}`} key={tab} onClick={() => onActiveChange(tab)} type="button">{tab === 'news' ? 'News' : tab === 'video' ? 'Video' : 'Event'}</button>)}</div>}</div>
    <form className="max-w-[790px] pt-2" onSubmit={onPublish}>
      <Field>Title<input className={inputClass} required name="title" minLength={3} maxLength={180} placeholder={active === 'news' ? 'Write a clear, compelling headline' : 'Give this content a title'} /></Field>
      {active === 'news' && <><Field>Short description / excerpt<input className={inputClass} required name="summary" minLength={10} maxLength={500} placeholder="A short introduction for readers" /></Field><div className="grid gap-0 md:grid-cols-2 md:gap-4"><Field>Category badge<input className={inputClass} name="category" placeholder="e.g. Business" /><span className="text-[10px] font-normal text-[#d92867]">Displayed as a red label on the article.</span></Field><div className="mt-[18px]"><MediaUpload token={token} accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" label="Featured image / thumbnail" onUploaded={(media) => onImageChange(media.url)} />{imageUrl && <input type="hidden" name="imageUrl" value={imageUrl} readOnly />}</div></div><div className="mt-[18px] grid gap-2 text-xs font-bold text-[#504b5b]"><span>Article content *</span><RichTextEditor onChange={onArticleContentChange} /></div><div className="flex gap-5 pt-4 text-[11px] text-[#5c5765]"><label><input type="checkbox" name="featured" /> Feature on homepage</label><label><input type="checkbox" name="breaking" /> Breaking news</label></div></>}
      {active === 'video' && <><Field>Description<textarea className={`${inputClass} resize-y`} name="description" rows={3} /></Field><div className="grid gap-0 md:grid-cols-2 md:gap-4"><Field>Video source<select className={inputClass} name="videoType"><option value="YOUTUBE">YouTube</option><option value="UPLOAD">Hosted video URL</option></select></Field><Field>YouTube video ID (optional)<input className={inputClass} name="youtubeId" placeholder="11-character video ID" /></Field></div><div className="mt-[18px]"><MediaUpload token={token} accept="video/*" label="Upload hosted video" onUploaded={(media) => onVideoChange(media.url)} /></div><Field>Video URL<input className={inputClass} name="videoUrl" type="url" placeholder="Or paste a hosted/YouTube URL" value={videoUrl} onChange={(event) => onVideoChange(event.target.value)} /></Field><label className="mt-4 flex items-center gap-2 text-[11px] text-[#5c5765]"><input type="checkbox" name="featured" /> Feature this video</label></>}
      {active === 'event' && <><Field>Event description<textarea className={`${inputClass} resize-y`} required name="description" rows={4} /></Field><div className="grid gap-0 md:grid-cols-2 md:gap-4"><Field>Date and time<input className={inputClass} required name="startsAt" type="datetime-local" /></Field><Field>Location<input className={inputClass} name="location" placeholder="Venue or online" /></Field></div><Field>Registration capacity<input className={inputClass} name="capacity" type="number" min="1" placeholder="No limit" /></Field><div className="mt-[18px]"><MediaUpload token={token} accept="image/*,video/*,.pdf,.doc,.docx,.txt" label="Upload event media or document" onUploaded={() => undefined} /></div></>}
      <div className="mt-[21px] flex flex-wrap items-center gap-2 border-t border-[#ebe8ef] pt-4 text-[11px] text-[#777283]"><span className="mr-auto basis-full md:basis-auto">Save a draft or publish now.</span><button className="rounded border border-[#dedbe3] bg-white px-3 py-2 text-[11px] font-bold" name="save" value="draft" disabled={busy}>Save draft</button><button className="rounded bg-[#d92867] px-4 py-3 text-xs font-bold text-white hover:bg-[#b91e54]" name="publish" value="yes" disabled={busy}>{busy ? 'Saving…' : 'Publish'}</button></div>
    </form>
  </section>;
}
