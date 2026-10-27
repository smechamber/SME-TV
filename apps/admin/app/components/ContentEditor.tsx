import type { AdminWorkspaceProps } from './AdminWorkspace';
import type { ManagedContent } from './content-studio/types';
import RichTextEditor from '../RichTextEditor';
import MediaUpload from '../MediaUpload';

export type ContentEditorProps = Pick<
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
> & {
  showTabs?: boolean;
  initialContent?: ManagedContent | null;
};

function Field({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`mt-[18px] grid gap-2 text-xs font-bold text-[#504b5b] ${className}`}>
      {children}
    </label>
  );
}

function youtubeIdFromValue(value: string) {
  return (
    value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)?.[1] ??
    (value.match(/^[\w-]{11}$/) ? value : '')
  );
}

function VideoPreview({ url, youtubeId }: { url: string; youtubeId: string }) {
  const id = youtubeIdFromValue(youtubeId) || youtubeIdFromValue(url);
  if (id) {
    return (
      <div className="mt-3 overflow-hidden rounded border border-[#ebe8ef] bg-black">
        <img
          className="aspect-video w-full object-cover"
          src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
          alt="YouTube video preview"
        />
        <p className="bg-white px-3 py-2 text-[10px] font-normal text-[#777283]">YouTube preview</p>
      </div>
    );
  }
  if (url)
    return (
      <video
        className="mt-3 max-h-56 w-full rounded border border-[#ebe8ef] object-cover"
        controls
        preload="metadata"
        src={url}
      />
    );
  return null;
}

export function ContentEditor({
  token,
  busy,
  active,
  imageUrl,
  videoUrl,
  initialContent,
  onActiveChange,
  onImageChange,
  onVideoChange,
  onPublish,
  onArticleContentChange,
  showTabs = true,
}: ContentEditorProps) {
  return (
    <section className="mt-[22px] rounded border border-[#ebe8ef] bg-white p-4 md:p-6" id="editor">
      <div className="flex flex-col justify-between gap-4 border-b border-[#ebe8ef] pb-5 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-[10px] font-extrabold tracking-[.15em] text-[#d92867]">
            PUBLISH TO ALL PLATFORMS
          </p>
          <h2 className="text-[19px] font-bold tracking-[-.03em]">
            Create {active === 'news' ? 'article' : active === 'video' ? 'video' : 'event'}
          </h2>
          <p className="mt-1 text-[11px] text-[#777283]">
            Published items are saved to the shared database and API.
          </p>
        </div>
        {showTabs && (
          <div className="flex w-max rounded bg-[#f4f2f6] p-1">
            {(['news', 'video', 'event'] as const).map((tab) => (
              <button
                className={`rounded px-3 py-2 text-[11px] ${active === tab ? 'bg-white text-[#d92867] shadow-sm' : 'text-[#777283]'}`}
                key={tab}
                onClick={() => onActiveChange(tab)}
                type="button"
              >
                {tab === 'news' ? 'News' : tab === 'video' ? 'Video' : 'Event'}
              </button>
            ))}
          </div>
        )}
      </div>
      <form className="max-w-[790px] pt-2" onSubmit={onPublish}>
        <Field>
          Title
          <input
            className={inputClass}
            required
            name="title"
            minLength={3}
            maxLength={180}
            defaultValue={initialContent?.title}
            placeholder={
              active === 'news' ? 'Write a clear, compelling headline' : 'Give this content a title'
            }
          />
        </Field>
        {active === 'news' && (
          <>
            <Field>
              Short description / excerpt
              <input
                className={inputClass}
                required
                name="summary"
                minLength={10}
                maxLength={500}
                defaultValue={initialContent?.summary}
                placeholder="A short introduction for readers"
              />
            </Field>
            <div className="grid gap-0 md:grid-cols-2 md:gap-4">
              <Field>
                Category badge
                <input
                  className={inputClass}
                  name="category"
                  defaultValue={initialContent?.category?.name}
                  placeholder="e.g. Business"
                />
                <span className="text-[10px] font-normal text-[#d92867]">
                  Displayed as a red label on the article.
                </span>
              </Field>
              <div className="mt-[18px]">
                <MediaUpload
                  token={token}
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  label="Featured image / thumbnail"
                  initialUrl={imageUrl}
                  onUploaded={(media) => onImageChange(media.url)}
                  onClear={() => onImageChange('')}
                />
                {imageUrl && <input type="hidden" name="imageUrl" value={imageUrl} readOnly />}
              </div>
            </div>
            <div className="mt-[18px] grid gap-2 text-xs font-bold text-[#504b5b]">
              <span>Article content *</span>
              <RichTextEditor
                initialContent={initialContent?.content}
                onChange={onArticleContentChange}
              />
            </div>
            <div className="flex gap-5 pt-4 text-[11px] text-[#5c5765]">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={initialContent?.isFeatured}
                />{' '}
                Feature on homepage
              </label>
              <label>
                <input
                  type="checkbox"
                  name="breaking"
                  defaultChecked={initialContent?.isBreaking}
                />{' '}
                Breaking news
              </label>
            </div>
          </>
        )}
        {active === 'video' && (
          <>
            <Field>
              Description
              <textarea
                className={`${inputClass} resize-y`}
                name="description"
                rows={3}
                defaultValue={initialContent?.description ?? ''}
              />
            </Field>
            <div className="grid gap-0 md:grid-cols-2 md:gap-4">
              <Field>
                Video source
                <select
                  className={inputClass}
                  name="videoType"
                  defaultValue={initialContent?.videoType ?? 'YOUTUBE'}
                >
                  <option value="YOUTUBE">YouTube</option>
                  <option value="UPLOAD">Hosted video URL</option>
                </select>
              </Field>
              <Field>
                YouTube video ID (optional)
                <input
                  className={inputClass}
                  name="youtubeId"
                  defaultValue={initialContent?.youtubeId ?? ''}
                  placeholder="11-character video ID"
                />
              </Field>
            </div>
            <div className="mt-[18px]">
              <MediaUpload
                token={token}
                accept="video/*"
                label="Upload hosted video"
                initialUrl={initialContent?.videoType === 'UPLOAD' ? videoUrl : ''}
                onUploaded={(media) => onVideoChange(media.url)}
                onClear={() => onVideoChange('')}
              />
            </div>
            <Field>
              Video URL
              <input
                className={inputClass}
                name="videoUrl"
                type="url"
                placeholder="Or paste a hosted/YouTube URL"
                value={videoUrl}
                onChange={(event) => onVideoChange(event.target.value)}
              />
            </Field>
            <VideoPreview url={videoUrl} youtubeId={initialContent?.youtubeId ?? ''} />
            {(videoUrl || initialContent?.youtubeId) && (
              <button
                className="mt-2 w-max rounded border border-[#f1c8d7] px-3 py-2 text-[11px] font-bold text-[#c5225b]"
                type="button"
                onClick={(event) => {
                  const youtubeInput = event.currentTarget.form?.elements.namedItem('youtubeId');
                  if (youtubeInput instanceof HTMLInputElement) youtubeInput.value = '';
                  onVideoChange('');
                }}
              >
                Remove video preview
              </button>
            )}
            <label className="mt-4 flex items-center gap-2 text-[11px] text-[#5c5765]">
              <input type="checkbox" name="featured" defaultChecked={initialContent?.isFeatured} />{' '}
              Feature this video
            </label>
          </>
        )}
        {active === 'event' && (
          <>
            <Field>
              Event description
              <textarea className={`${inputClass} resize-y`} required name="description" rows={4} />
            </Field>
            <div className="grid gap-0 md:grid-cols-2 md:gap-4">
              <Field>
                Date and time
                <input className={inputClass} required name="startsAt" type="datetime-local" />
              </Field>
              <Field>
                Location
                <input className={inputClass} name="location" placeholder="Venue or online" />
              </Field>
            </div>
            <Field>
              Registration capacity
              <input
                className={inputClass}
                name="capacity"
                type="number"
                min="1"
                placeholder="No limit"
              />
            </Field>
            <div className="mt-[18px]">
              <MediaUpload
                token={token}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                label="Upload event media or document"
                onUploaded={() => undefined}
              />
            </div>
          </>
        )}
        <div className="mt-[21px] flex flex-wrap items-center gap-2 border-t border-[#ebe8ef] pt-4 text-[11px] text-[#777283]">
          <span className="mr-auto basis-full md:basis-auto">Save a draft or publish now.</span>
          <button
            className="rounded border border-[#dedbe3] bg-white px-3 py-2 text-[11px] font-bold"
            name="save"
            value="draft"
            disabled={busy}
          >
            Save draft
          </button>
          <button
            className="rounded bg-[#d92867] px-4 py-3 text-xs font-bold text-white hover:bg-[#b91e54]"
            name="publish"
            value="yes"
            disabled={busy}
          >
            {busy ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </form>
    </section>
  );
}
