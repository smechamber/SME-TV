'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminWorkspace, { type ContentType } from './components/AdminWorkspace';
import type { ManagedContent } from './components/content-studio/types';
import { initialStats, type Registration, type Stats } from './types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<Stats>(initialStats);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<ContentType>('news');
  const [articleContent, setArticleContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [editingContent, setEditingContent] = useState<ManagedContent | null>(null);

  useEffect(() => {
    const savedToken = window.localStorage.getItem('smetv-admin-token');
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    loadDashboard(token);
  }, [token]);

  useEffect(() => {
    setVideoUrl(editingContent?.videoUrl ?? '');
    setArticleContent(editingContent?.content ?? '');
    setImageUrl(editingContent?.imageUrl ?? '');
  }, [editingContent]);

  async function loadDashboard(adminToken: string) {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const statsResponse = await fetch(`${API}/api/admin/stats`, { headers });
      if (!statsResponse.ok)
        throw new Error('Your admin session is invalid or expired. Please sign in again.');
      const statsPayload = (await statsResponse.json()) as { data: Stats };
      setStats(statsPayload.data);

      const registrationsResponse = await fetch(`${API}/api/admin/registrations`, { headers });
      if (registrationsResponse.ok) {
        const payload = (await registrationsResponse.json()) as { data?: Registration[] };
        setRegistrations(payload.data ?? []);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to load the admin dashboard');
      clearSession();
    }
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const response = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { data?: { token: string }; message?: string };
      if (!response.ok || !payload.data) throw new Error(payload.message ?? 'Unable to sign in');
      window.localStorage.setItem('smetv-admin-token', payload.data.token);
      setToken(payload.data.token);
      setPassword('');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice('');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status = submitter?.value === 'yes' ? 'PUBLISHED' : 'DRAFT';
    const request = createContentRequest(active, form, { articleContent, imageUrl, videoUrl });

    try {
      const response = await fetch(
        `${API}${request.path}${editingContent ? `/${editingContent.id}` : ''}`,
        {
          method: editingContent ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...request.body, status }),
        },
      );
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(payload.message ?? 'Unable to save content');
      setNotice(
        status === 'PUBLISHED'
          ? 'Published successfully. It is now available through the shared API.'
          : 'Draft saved successfully.',
      );
      formElement.reset();
      setEditingContent(null);
      if (active === 'news') {
        setImageUrl('');
        setArticleContent('');
        setStats((previous) => ({
          ...previous,
          drafts: status === 'DRAFT' ? previous.drafts + 1 : previous.drafts,
          publishedArticles:
            status === 'PUBLISHED' ? previous.publishedArticles + 1 : previous.publishedArticles,
        }));
      }
      if (active === 'video') setVideoUrl('');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save content');
    } finally {
      setBusy(false);
    }
  }

  function clearSession() {
    window.localStorage.removeItem('smetv-admin-token');
    setToken('');
  }

  function signOut() {
    if (token) {
      void fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    clearSession();
  }

  if (!token) {
    return (
      <AdminLogin
        email={email}
        password={password}
        busy={busy}
        notice={notice}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={signIn}
      />
    );
  }

  return (
    <AdminWorkspace
      token={token}
      stats={stats}
      registrations={registrations}
      notice={notice}
      busy={busy}
      active={active}
      imageUrl={imageUrl}
      videoUrl={videoUrl}
      onActiveChange={setActive}
      onImageChange={setImageUrl}
      onVideoChange={setVideoUrl}
      onSignOut={signOut}
      onPublish={publish}
      onArticleContentChange={setArticleContent}
      onNotice={setNotice}
      editingContent={editingContent}
      onEditContent={(type, item) => {
        setActive(type);
        setEditingContent(item);
      }}
    />
  );
}

function createContentRequest(
  type: ContentType,
  form: FormData,
  media: { articleContent: string; imageUrl: string; videoUrl: string },
) {
  if (type === 'news') {
    return {
      path: '/api/admin/news',
      body: {
        title: form.get('title'),
        summary: form.get('summary'),
        content: media.articleContent,
        imageUrl: media.imageUrl || undefined,
        category: form.get('category'),
        isFeatured: form.has('featured'),
        isBreaking: form.has('breaking'),
      },
    };
  }

  if (type === 'video') {
    return {
      path: '/api/admin/videos',
      body: {
        title: form.get('title'),
        description: form.get('description'),
        videoType: form.get('videoType'),
        videoUrl: media.videoUrl || undefined,
        youtubeId: form.get('youtubeId') || undefined,
        isFeatured: form.has('featured'),
      },
    };
  }

  return {
    path: '/api/admin/events',
    body: {
      title: form.get('title'),
      description: form.get('description'),
      startsAt: new Date(String(form.get('startsAt'))).toISOString(),
      location: form.get('location'),
      capacity: form.get('capacity') ? Number(form.get('capacity')) : undefined,
    },
  };
}
