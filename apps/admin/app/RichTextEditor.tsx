'use client';
import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { TableKit } from '@tiptap/extension-table';
import Youtube from '@tiptap/extension-youtube';

const extensions = [StarterKit.configure({ link: { openOnClick: false } }), TextAlign.configure({ types: ['heading', 'paragraph'] }), Image.configure({ allowBase64: false }), TableKit, Youtube.configure({ nocookie: true, controls: true })];
const draftKey = 'smetv-article-draft-v1';
export default function RichTextEditor({ onChange }: { onChange: (html: string) => void }) {
  const [preview, setPreview] = useState(false);
  const editor = useEditor({ extensions, immediatelyRender: false, content: '<p></p>', onUpdate: ({ editor }) => { const html = editor.getHTML(); onChange(html); window.localStorage.setItem(draftKey, html); } });
  useEffect(() => { if (!editor) return; const draft = window.localStorage.getItem(draftKey); if (draft && editor.getText().length === 0) { editor.commands.setContent(draft); onChange(draft); } }, [editor, onChange]);
  if (!editor) return <div className="rich-editor-loading">Loading editor…</div>;
  const activeEditor = editor;
  function run(command: () => void) { if (preview) return; command(); activeEditor.commands.focus(); }
  function insertImage() { const src = window.prompt('Image URL (upload through your configured media service first)'); if (!src) return; try { const url = new URL(src); if (!['https:', 'http:'].includes(url.protocol)) throw new Error(); } catch { window.alert('Enter a valid http or https image URL.'); return; } const alt = window.prompt('Image alt text', '') ?? ''; run(() => activeEditor.chain().focus().setImage({ src, alt, title: alt }).run()); }
  function insertYoutube() { const src = window.prompt('YouTube video URL'); if (!src) return; run(() => activeEditor.commands.setYoutubeVideo({ src })); }
  return <div className="rich-editor"><div className="editor-toolbar" aria-label="Article formatting toolbar">
    <select aria-label="Heading level" disabled={preview} value={editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'} onChange={e => run(() => e.target.value === 'p' ? editor.chain().focus().setParagraph().run() : editor.chain().focus().toggleHeading({ level: e.target.value === 'h2' ? 2 : 3 }).run())}><option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option></select>
    <button type="button" title="Bold" onClick={() => run(() => editor.chain().focus().toggleBold().run())}><b>B</b></button><button type="button" title="Italic" onClick={() => run(() => editor.chain().focus().toggleItalic().run())}><i>I</i></button><button type="button" title="Underline" onClick={() => run(() => editor.chain().focus().toggleUnderline().run())}><u>U</u></button><button type="button" title="Bulleted list" onClick={() => run(() => editor.chain().focus().toggleBulletList().run())}>• List</button><button type="button" title="Numbered list" onClick={() => run(() => editor.chain().focus().toggleOrderedList().run())}>1. List</button>
    <span className="toolbar-divider"/><button type="button" title="Align left" onClick={() => run(() => editor.chain().focus().setTextAlign('left').run())}>=</button><button type="button" title="Align center" onClick={() => run(() => editor.chain().focus().setTextAlign('center').run())}>?</button><button type="button" title="Align right" onClick={() => run(() => editor.chain().focus().setTextAlign('right').run())}>=</button><button type="button" title="Justify" onClick={() => run(() => editor.chain().focus().setTextAlign('justify').run())}>?</button>
    <span className="toolbar-divider"/><button type="button" title="Insert link" onClick={() => { const href = window.prompt('Link URL'); if (href) run(() => editor.chain().focus().extendMarkRange('link').setLink({ href }).run()); }}>Link</button><button type="button" title="Insert image" onClick={insertImage}>Image</button><button type="button" title="Insert YouTube video" onClick={insertYoutube}>Video</button><button type="button" title="Insert table" onClick={() => run(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}>Table</button><button type="button" title="Horizontal divider" onClick={() => run(() => editor.chain().focus().setHorizontalRule().run())}>—</button><span className="toolbar-divider"/><button type="button" title="Undo" onClick={() => run(() => editor.chain().focus().undo().run())}>?</button><button type="button" title="Redo" onClick={() => run(() => editor.chain().focus().redo().run())}>?</button><button type="button" className={preview ? 'preview-on' : ''} onClick={() => { setPreview(!preview); editor.setEditable(preview); }}>{preview ? 'Continue editing' : 'Preview'}</button>
  </div><EditorContent editor={editor} className={`rich-editor-content ${preview ? 'editor-preview' : ''}`} /><input type="hidden" name="content" value={editor.getHTML()} readOnly /><div className="editor-footnote">Draft recovery is saved in this browser. Images use a URL until media uploads are connected.</div></div>;
}
