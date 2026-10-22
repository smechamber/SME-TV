'use client';

import type { FormEvent } from 'react';
import RichTextEditor from '../RichTextEditor';
import MediaUpload from '../MediaUpload';
import type { Registration, Stats } from '../types';

export type ContentType = 'news' | 'video' | 'event';

type AdminWorkspaceProps = {
  token: string;
  stats: Stats;
  registrations: Registration[];
  notice: string;
  busy: boolean;
  active: ContentType;
  imageUrl: string;
  videoUrl: string;
  onActiveChange: (type: ContentType) => void;
  onImageChange: (url: string) => void;
  onVideoChange: (url: string) => void;
  onSignOut: () => void;
  onPublish: (event: FormEvent<HTMLFormElement>) => void;
  onArticleContentChange: (content: string) => void;
};

const statLabels: [keyof Stats, string][] = [
  ['publishedArticles', 'Published articles'],
  ['drafts', 'Draft articles'],
  ['videos', 'Published videos'],
  ['upcomingEvents', 'Upcoming events'],
  ['registrations', 'Event registrations'],
  ['users', 'Registered users'],
];

export default function AdminWorkspace({
  token,
  stats,
  registrations,
  notice,
  busy,
  active,
  imageUrl,
  videoUrl,
  onActiveChange,
  onImageChange,
  onVideoChange,
  onSignOut,
  onPublish,
  onArticleContentChange,
}: AdminWorkspaceProps) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-logo" href="/">
          SME<span>TV</span>
        </a>
        <span className="sidebar-caption">WORKSPACE</span>
        <a className="sidebar-item selected" href="#overview">
          Overview
        </a>
        <a className="sidebar-item" href="#editor">
          Content studio
        </a>
        <a className="sidebar-item" href="#registrations">
          Registrations
        </a>
        <div className="sidebar-bottom">
          <span className="avatar">A</span>
          <span>
            <strong>Administrator</strong>
            <small>SME TV newsroom</small>
          </span>
          <button onClick={onSignOut} aria-label="Sign out">
            ×
          </button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <span>
            SME TV <span className="crumb">/ Overview</span>
          </span>
          <button className="signout-button" onClick={onSignOut}>
            Sign out
          </button>
        </header>
        <div className="admin-content" id="overview">
          <div className="admin-page-heading">
            <div>
              <p className="admin-kicker">NEWSROOM OVERVIEW</p>
              <h1>Good day, Admin</h1>
              <p>Manage the stories and events reaching your community.</p>
            </div>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="preview-button"
            >
              View website
            </a>
          </div>
          {notice && <div className="admin-notice">{notice}</div>}
          <div className="stats-grid">
            {statLabels.map(([key, label]) => (
              <div className="stat-card" key={key}>
                <span>{label}</span>
                <strong>{stats[key]}</strong>
                <small>Shared platform data</small>
              </div>
            ))}
          </div>

          <RegistrationsPanel registrations={registrations} />
          <ContentStudio
            token={token}
            busy={busy}
            active={active}
            imageUrl={imageUrl}
            videoUrl={videoUrl}
            onActiveChange={onActiveChange}
            onImageChange={onImageChange}
            onVideoChange={onVideoChange}
            onPublish={onPublish}
            onArticleContentChange={onArticleContentChange}
          />
        </div>
      </section>
    </main>
  );
}

function RegistrationsPanel({ registrations }: { registrations: Registration[] }) {
  return (
    <section className="registrations-panel" id="registrations">
      <div className="editor-heading">
        <div>
          <p className="admin-kicker">COMMUNITY</p>
          <h2>Recent event registrations</h2>
        </div>
      </div>
      {registrations.length ? (
        <div className="registration-table-wrap">
          <table className="registration-table">
            <thead>
              <tr>
                <th>Attendee</th>
                <th>Company</th>
                <th>Event</th>
                <th>Contact</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.companyName}</td>
                  <td>{item.event.title}</td>
                  <td>
                    {item.email}
                    <br />
                    {item.mobile}
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="registration-empty">No event registrations have been submitted yet.</p>
      )}
    </section>
  );
}

type ContentStudioProps = Pick<
  AdminWorkspaceProps,
  | 'token'
  | 'busy'
  | 'active'
  | 'imageUrl'
  | 'videoUrl'
  | 'onActiveChange'
  | 'onImageChange'
  | 'onVideoChange'
  | 'onPublish'
  | 'onArticleContentChange'
>;

function ContentStudio({
  token,
  busy,
  active,
  imageUrl,
  videoUrl,
  onActiveChange,
  onImageChange,
  onVideoChange,
  onPublish,
  onArticleContentChange,
}: ContentStudioProps) {
  return (
    <section className="editor-panel" id="editor">
      <div className="editor-heading">
        <div>
          <p className="admin-kicker">PUBLISH TO ALL PLATFORMS</p>
          <h2>Content studio</h2>
          <p>Published items are served to the public website and mobile clients from one API.</p>
        </div>
        <div className="content-tabs">
          {(['news', 'video', 'event'] as const).map((tab) => (
            <button
              key={tab}
              className={active === tab ? 'active' : ''}
              onClick={() => onActiveChange(tab)}
            >
              {tab === 'news' ? 'News' : tab === 'video' ? 'Video' : 'Event'}
            </button>
          ))}
        </div>
      </div>

      <form className="content-form" onSubmit={onPublish}>
        <label>
          Title
          <input
            required
            name="title"
            minLength={3}
            maxLength={180}
            placeholder={
              active === 'news' ? 'Write a clear, compelling headline' : 'Give this content a title'
            }
          />
        </label>

        {active === 'news' && (
          <>
            <label>
              Summary
              <input
                required
                name="summary"
                minLength={10}
                maxLength={500}
                placeholder="A short introduction for readers"
              />
            </label>
            <div className="form-row">
              <label>
                Category
                <input name="category" placeholder="e.g. Business" />
              </label>
              <div className="media-field">
                <MediaUpload
                  token={token}
                  accept="image/*"
                  label="Featured image"
                  onUploaded={(media) => onImageChange(media.url)}
                />
                {imageUrl && <input type="hidden" name="imageUrl" value={imageUrl} readOnly />}
              </div>
            </div>
            <div className="rich-editor-field">
              <span>Article content *</span>
              <RichTextEditor onChange={onArticleContentChange} />
            </div>
            <div className="form-checks">
              <label>
                <input type="checkbox" name="featured" /> Feature on homepage
              </label>
              <label>
                <input type="checkbox" name="breaking" /> Breaking news
              </label>
            </div>
          </>
        )}

        {active === 'video' && (
          <>
            <label>
              Description
              <textarea name="description" rows={3} />
            </label>
            <div className="form-row">
              <label>
                Video source
                <select name="videoType">
                  <option value="YOUTUBE">YouTube</option>
                  <option value="UPLOAD">Hosted video URL</option>
                </select>
              </label>
              <label>
                YouTube video ID (optional)
                <input name="youtubeId" placeholder="11-character video ID" />
              </label>
            </div>
            <div className="media-field">
              <MediaUpload
                token={token}
                accept="video/*"
                label="Upload hosted video"
                onUploaded={(media) => onVideoChange(media.url)}
              />
            </div>
            <label>
              Video URL
              <input
                name="videoUrl"
                type="url"
                placeholder="Or paste a hosted/YouTube URL"
                value={videoUrl}
                onChange={(event) => onVideoChange(event.target.value)}
              />
            </label>
            <label>
              <input type="checkbox" name="featured" /> Feature this video
            </label>
          </>
        )}

        {active === 'event' && (
          <>
            <label>
              Event description
              <textarea required name="description" rows={4} />
            </label>
            <div className="form-row">
              <label>
                Date and time
                <input required name="startsAt" type="datetime-local" />
              </label>
              <label>
                Location
                <input name="location" placeholder="Venue or online" />
              </label>
            </div>
            <label>
              Registration capacity
              <input name="capacity" type="number" min="1" placeholder="No limit" />
            </label>
            <div className="media-field">
              <MediaUpload
                token={token}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                label="Upload event media or document"
                onUploaded={() => undefined}
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <span>Save a draft or publish now.</span>
          <button className="secondary-button" name="save" value="draft" disabled={busy}>
            Save draft
          </button>
          <button className="admin-button" name="publish" value="yes" disabled={busy}>
            {busy ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </form>
    </section>
  );
}
