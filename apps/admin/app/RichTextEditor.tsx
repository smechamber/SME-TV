'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import Youtube from '@tiptap/extension-youtube';

const extensions = [
  StarterKit.configure({ link: { openOnClick: false } }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Image.configure({ allowBase64: false }),
  TableKit,
  Youtube.configure({ nocookie: true, controls: true }),
];
const draftKey = 'smetv-article-draft-v1';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function RichTextEditor({ onChange, initialContent = '', token = '' }: {
  onChange: (html: string) => void; initialContent?: string; token?: string;
}) {
  const [preview, setPreview] = useState(false);
  const [sourceMode, setSourceMode] = useState(false);
  const [html, setHtml] = useState(initialContent || '<p></p>');
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const imageInput = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions, immediatelyRender: false, content: '<p></p>',
    onUpdate: ({ editor }) => {
      const value = editor.getHTML();
      setHtml(value); onChange(value); window.localStorage.setItem(draftKey, value);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (initialContent) {
      editor.commands.setContent(initialContent); setHtml(initialContent); onChange(initialContent); return;
    }
    const draft = window.localStorage.getItem(draftKey);
    if (draft && editor.getText().length === 0) {
      editor.commands.setContent(draft); setHtml(draft); onChange(draft);
    }
  }, [editor, initialContent, onChange]);

  if (!editor) return <div className="rounded border border-[#dedbe3] p-4 text-xs text-[#777283]">Loading editor…</div>;

  function run(command: () => void) { if (!preview) { command(); editor?.commands.focus(); } }
  function insertImage() {
    const src = window.prompt('Image URL'); if (!src) return;
    try { const url = new URL(src); if (!['https:', 'http:'].includes(url.protocol)) throw new Error(); }
    catch { window.alert('Enter a valid http or https image URL.'); return; }
    const alt = window.prompt('Image alt text', '') ?? '';
    run(() => editor.chain().focus().setImage({ src, alt, title: alt }).run());
  }
  async function uploadImage(file?: File) {
    if (!file) return;
    setUploading(true); setNotice('');
    try {
      const body = new FormData(); body.append('file', file);
      const response = await fetch(`${API}/api/admin/media`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body });
      const payload = await response.json() as { data?: { url: string }; message?: string };
      if (!response.ok || !payload.data?.url) throw new Error(payload.message ?? 'Image upload failed');
      const alt = window.prompt('Image alt text', '') ?? '';
      run(() => editor.chain().focus().setImage({ src: payload.data!.url, alt, title: alt }).run());
      setNotice('Image uploaded and added to the content.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Image upload failed'); }
    finally { setUploading(false); if (imageInput.current) imageInput.current.value = ''; }
  }
  function insertYoutube() { const src = window.prompt('YouTube video URL'); if (src) run(() => editor.commands.setYoutubeVideo({ src })); }

  const buttonClass = 'rounded px-2 py-1 text-[11px] text-[#4d4655] hover:bg-[#eee5ee] hover:text-[#d92867] disabled:opacity-45';
  const previewDocument = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{max-width:760px;margin:40px auto;padding:0 20px;font:18px/1.8 Georgia,serif;color:#302b36}img,video,iframe{max-width:100%}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}</style></head><body>${html}</body></html>`;

  return <div className="grid gap-2">
    <div className="flex flex-wrap gap-1 rounded-t border border-[#dedbe3] bg-[#f8f7f9] p-2" aria-label="Content formatting toolbar">
      <select className="rounded border-0 bg-transparent px-2 py-1 text-[11px]" aria-label="Heading level" disabled={preview || sourceMode} value={editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'} onChange={event => run(() => event.target.value === 'p' ? editor.chain().focus().setParagraph().run() : editor.chain().focus().toggleHeading({ level: event.target.value === 'h2' ? 2 : 3 }).run())}>
        <option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option>
      </select>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().toggleBold().run())}><b>B</b></button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().toggleItalic().run())}><i>I</i></button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().toggleBulletList().run())}>• List</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())}>1. List</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().setTextAlign('left').run())}>Left</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().setTextAlign('center').run())}>Center</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().setTextAlign('right').run())}>Right</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => { const href = window.prompt('Link URL'); if (href) run(() => editor.chain().focus().extendMarkRange('link').setLink({ href }).run()); }}>Link</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={insertImage}>Image URL</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode || uploading} onClick={() => imageInput.current?.click()}>{uploading ? 'Uploading…' : 'Upload image'}</button>
      <input ref={imageInput} className="hidden" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => void uploadImage(event.target.files?.[0])} />
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={insertYoutube}>Video</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}>Table</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().setHorizontalRule().run())}>—</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().undo().run())}>Undo</button>
      <button className={buttonClass} type="button" disabled={preview || sourceMode} onClick={() => run(() => editor.chain().focus().redo().run())}>Redo</button>
      <button className={`${buttonClass} ${sourceMode ? 'bg-[#eee5ee] text-[#d92867]' : ''}`} type="button" onClick={() => { setSourceMode(!sourceMode); setPreview(false); editor.setEditable(true); }}>{sourceMode ? 'Rich text' : 'HTML'}</button>
      <button className={`${buttonClass} ${preview ? 'bg-[#eee5ee] text-[#d92867]' : ''}`} type="button" onClick={() => { setPreview(!preview); setSourceMode(false); editor.setEditable(preview); }}>{preview ? 'Continue editing' : 'Preview'}</button>
    </div>
    {notice && <p className="text-[11px] font-normal text-[#24724f]">{notice}</p>}
    {preview ? <iframe title="Content preview" sandbox="" className="min-h-[420px] w-full rounded border border-[#dedbe3] bg-white" srcDoc={previewDocument} />
      : sourceMode ? <textarea aria-label="HTML content" className="min-h-[360px] w-full rounded border border-[#dedbe3] p-4 font-mono text-xs leading-6" value={html} onChange={event => {
        const value = event.target.value; setHtml(value); editor.commands.setContent(value); onChange(value); window.localStorage.setItem(draftKey, value);
      }} />
      : <EditorContent editor={editor} className="min-h-[260px] rounded-b border border-[#dedbe3] p-4 text-sm leading-7 focus-within:border-[#a35a83] focus-within:ring-4 focus-within:ring-[#d9286714]" />}
    <input type="hidden" name="content" value={html} readOnly />
    <div className="text-[10px] font-normal text-[#777283]">Use rich text tools or edit HTML directly. Uploaded images are saved with your content.</div>
  </div>;
}
