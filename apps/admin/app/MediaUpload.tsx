'use client';

import { ChangeEvent, useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type UploadedMedia = { url: string; resourceType: 'image' | 'video' | 'document' };

export default function MediaUpload({
  token,
  accept,
  label = 'Upload media',
  onUploaded,
}: {
  token: string;
  accept: string;
  label?: string;
  onUploaded: (media: UploadedMedia) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploaded, setUploaded] = useState<UploadedMedia | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => () => {
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setNotice('');
    const localPreview = file.type.startsWith('image/') || file.type.startsWith('video/')
      ? URL.createObjectURL(file)
      : '';
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(localPreview);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch(`${API}/api/admin/media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const payload = await response.json() as { data?: UploadedMedia; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message ?? 'Upload failed');
      setUploaded(payload.data);
      onUploaded(payload.data);
      setNotice('Uploaded successfully');
    } catch (error) {
      setUploaded(null);
      setNotice(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  return <div className="media-upload">
    <label>{label}<input type="file" accept={accept} onChange={upload} disabled={busy} /></label>
    {busy && <span className="upload-status">Uploading to media server…</span>}
    {notice && <span className={uploaded ? 'upload-status success' : 'upload-status error'}>{notice}</span>}
    {uploaded?.resourceType === 'image' && <img className="media-preview" src={uploaded.url} alt="Uploaded preview" />}
    {uploaded?.resourceType === 'video' && <video className="media-preview" controls src={uploaded.url} />}
    {uploaded?.resourceType === 'document' && <a className="media-document-preview" href={uploaded.url} target="_blank" rel="noreferrer">Open uploaded document</a>}
    {uploaded && <input type="text" readOnly value={uploaded.url} aria-label="Uploaded media URL" />}
  </div>;
}
