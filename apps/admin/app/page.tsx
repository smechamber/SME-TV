'use client';

import { FormEvent, useEffect, useState } from 'react';
import RichTextEditor from './RichTextEditor';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
type Stats = { publishedArticles: number; drafts: number; videos: number; upcomingEvents: number; registrations: number; users: number };
type Registration = { id: string; name: string; email: string; mobile: string; companyName: string; createdAt: string; event: { title: string; startsAt: string } };
const initialStats: Stats = { publishedArticles: 0, drafts: 0, videos: 0, upcomingEvents: 0, registrations: 0, users: 0 };

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState(initialStats);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<'news' | 'video' | 'event'>('news');
  const [articleContent, setArticleContent] = useState('');

  useEffect(() => { const saved = window.localStorage.getItem('smetv-admin-token'); if (saved) setToken(saved); }, []);
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(async response => {
      if (!response.ok) throw new Error('Your admin session is invalid or expired. Please sign in again.');
      const payload: any = await response.json(); setStats(payload.data);
      const registrationResponse = await fetch(`${API}/api/admin/registrations`, { headers: { Authorization: `Bearer ${token}` } });
      if (registrationResponse.ok) { const result = await registrationResponse.json() as { data?: Registration[] }; setRegistrations(result.data ?? []); }
    }).catch(error => { setNotice(error.message); setToken(''); window.localStorage.removeItem('smetv-admin-token'); });
  }, [token]);

  async function signIn(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice('');
    try { const response = await fetch(`${API}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); const payload: any = await response.json(); if (!response.ok) throw new Error(payload.message ?? 'Unable to sign in'); if (!['ADMIN', 'EDITOR'].includes(payload.data.user.role)) throw new Error('This account does not have administrator access'); window.localStorage.setItem('smetv-admin-token', payload.data.token); setToken(payload.data.token); setPassword(''); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to sign in'); } finally { setBusy(false); }
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(''); const formElement = event.currentTarget; const form = new FormData(formElement); const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null; const status = submitter?.value === 'yes' ? 'PUBLISHED' : 'DRAFT';
    let path = '/api/admin/news'; let body: Record<string, unknown>;
    if (active === 'news') body = { title: form.get('title'), summary: form.get('summary'), content: articleContent, imageUrl: form.get('imageUrl') || undefined, category: form.get('category'), status, isFeatured: form.has('featured'), isBreaking: form.has('breaking') };
    else if (active === 'video') { path = '/api/admin/videos'; body = { title: form.get('title'), description: form.get('description'), videoType: form.get('videoType'), videoUrl: form.get('videoUrl'), youtubeId: form.get('youtubeId') || undefined, status, isFeatured: form.has('featured') }; }
    else { path = '/api/admin/events'; body = { title: form.get('title'), description: form.get('description'), startsAt: new Date(String(form.get('startsAt'))).toISOString(), location: form.get('location'), status, capacity: form.get('capacity') ? Number(form.get('capacity')) : undefined }; }
    try { const response = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }); const payload: any = await response.json(); if (!response.ok) throw new Error(payload.message ?? 'Unable to save content'); setNotice(status === 'PUBLISHED' ? 'Published successfully. It is now available through the shared API.' : 'Draft saved successfully.'); formElement.reset(); if (active === 'news') setStats(prev => ({ ...prev, drafts: status === 'DRAFT' ? prev.drafts + 1 : prev.drafts, publishedArticles: status === 'PUBLISHED' ? prev.publishedArticles + 1 : prev.publishedArticles })); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to save content'); } finally { setBusy(false); }
  }

  function signOut() { const saved = window.localStorage.getItem('smetv-admin-token'); if (saved) void fetch(`${API}/api/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${saved}` } }); window.localStorage.removeItem('smetv-admin-token'); setToken(''); }

  if (!token) return <main className="admin-login"><form onSubmit={signIn} className="login-card"><span className="admin-logo">SME<span>TV</span></span><p className="admin-kicker">CONTENT MANAGEMENT</p><h1>Welcome back</h1><p className="admin-muted">Sign in with an administrator account to manage content across SME TV.</p>{notice && <div className="admin-notice error">{notice}</div>}<label>Email address<input required type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label><button className="admin-button" disabled={busy}>{busy ? 'Signing inâ€¦' : 'Sign in'}</button><span className="login-footnote">Administrator access is managed by your platform administrator.</span></form></main>;

  const labels: [keyof Stats, string][] = [['publishedArticles', 'Published articles'], ['drafts', 'Draft articles'], ['videos', 'Published videos'], ['upcomingEvents', 'Upcoming events'], ['registrations', 'Event registrations'], ['users', 'Registered users']];
  return <main className="admin-shell"><aside className="admin-sidebar"><a className="admin-logo" href="/">SME<span>TV</span></a><span className="sidebar-caption">WORKSPACE</span><a className="sidebar-item selected" href="#overview">? &nbsp; Overview</a><a className="sidebar-item" href="#editor">? &nbsp; Content studio</a><a className="sidebar-item" href="#editor">? &nbsp; Events</a><div className="sidebar-bottom"><span className="avatar">A</span><span><strong>Administrator</strong><small>SME TV newsroom</small></span><button onClick={signOut} aria-label="Sign out">?</button></div></aside><section className="admin-main"><header className="admin-topbar"><span>SME TV <span className="crumb">/ Overview</span></span><button className="signout-button" onClick={signOut}>Sign out</button></header><div className="admin-content" id="overview"><div className="admin-page-heading"><div><p className="admin-kicker">NEWSROOM OVERVIEW</p><h1>Good day, Admin</h1><p>Manage the stories and events reaching your community.</p></div><a href="http://localhost:3000" target="_blank" rel="noreferrer" className="preview-button">? View website</a></div>{notice && <div className="admin-notice">{notice}</div>}<div className="stats-grid">{labels.map(([key, label]) => <div className="stat-card" key={key}><span>{label}</span><strong>{stats[key]}</strong><small>Shared platform data</small></div>)}</div><section className="registrations-panel" id="registrations"><div className="editor-heading"><div><p className="admin-kicker">COMMUNITY</p><h2>Recent event registrations</h2></div></div>{registrations.length ? <div className="registration-table-wrap"><table className="registration-table"><thead><tr><th>Attendee</th><th>Company</th><th>Event</th><th>Contact</th><th>Received</th></tr></thead><tbody>{registrations.map(item => <tr key={item.id}><td>{item.name}</td><td>{item.companyName}</td><td>{item.event.title}</td><td>{item.email}<br />{item.mobile}</td><td>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div> : <p className="registration-empty">No event registrations have been submitted yet.</p>}</section><section className="editor-panel" id="editor"><div className="editor-heading"><div><p className="admin-kicker">PUBLISH TO ALL PLATFORMS</p><h2>Content studio</h2><p>Published items are served to the public website and mobile clients from one API.</p></div><div className="content-tabs">{(['news', 'video', 'event'] as const).map(tab => <button key={tab} className={active === tab ? 'active' : ''} onClick={() => setActive(tab)}>{tab === 'news' ? 'News' : tab === 'video' ? 'Video' : 'Event'}</button>)}</div></div><form className="content-form" onSubmit={publish}><label>Title<input required name="title" minLength={3} maxLength={180} placeholder={active === 'news' ? 'Write a clear, compelling headline' : 'Give this content a title'} /></label>{active === 'news' && <><label>Summary<input required name="summary" minLength={10} maxLength={500} placeholder="A short introduction for readers" /></label><div className="form-row"><label>Category<input name="category" placeholder="e.g. Business" /></label><label>Featured image URL<input name="imageUrl" type="url" placeholder="https://â€¦" /></label></div><div className="rich-editor-field"><span>Article content *</span><RichTextEditor onChange={setArticleContent} /></div><div className="form-checks"><label><input type="checkbox" name="featured" /> Feature on homepage</label><label><input type="checkbox" name="breaking" /> Breaking news</label></div></>}{active === 'video' && <><label>Description<textarea name="description" rows={3} /></label><div className="form-row"><label>Video source<select name="videoType"><option value="YOUTUBE">YouTube</option><option value="UPLOAD">Hosted video URL</option></select></label><label>YouTube video ID (optional)<input name="youtubeId" placeholder="11-character video ID" /></label></div><label>Video URL<input name="videoUrl" type="url" placeholder="YouTube or hosted video URL" /></label><label><input type="checkbox" name="featured" /> Feature this video</label></>}{active === 'event' && <><label>Event description<textarea required name="description" rows={4} /></label><div className="form-row"><label>Date and time<input required name="startsAt" type="datetime-local" /></label><label>Location<input name="location" placeholder="Venue or online" /></label></div><label>Registration capacity<input name="capacity" type="number" min="1" placeholder="No limit" /></label></>}<div className="form-actions"><span>Save a draft or publish now.</span><button className="secondary-button" name="save" value="draft" disabled={busy}>Save draft</button><button className="admin-button" name="publish" value="yes" disabled={busy}>{busy ? 'Savingâ€¦' : 'Publish'}</button></div></form></section></div></section></main>;
}




