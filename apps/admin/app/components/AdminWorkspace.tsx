'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import type { Registration, Stats } from '../types';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import ContentStudioPage from './ContentStudioPage';
import OverviewPage from './OverviewPage';

export type ContentType = 'news' | 'video' | 'event';

export type AdminWorkspaceProps = {
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

export default function AdminWorkspace(props: AdminWorkspaceProps) {
  const [activeView, setActiveView] = useState<'overview' | 'content-studio'>('overview');

  function showRegistrations() {
    setActiveView('overview');
    window.requestAnimationFrame(() => {
      document.getElementById('registrations')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  return (
    <main className="min-h-screen bg-[#f7f6f9] text-[#282338]">
      <AdminSidebar
        activeView={activeView}
        onOverview={() => setActiveView('overview')}
        onContentStudio={() => setActiveView('content-studio')}
        onRegistrations={showRegistrations}
        onSignOut={props.onSignOut}
      />
      <section className="ml-0 min-h-screen md:ml-[225px]">
        <AdminTopbar activeView={activeView} onSignOut={props.onSignOut} />
        {activeView === 'content-studio' ? (
          <ContentStudioPage />
        ) : (
          <OverviewPage {...props} />
        )}
      </section>
    </main>
  );
}
