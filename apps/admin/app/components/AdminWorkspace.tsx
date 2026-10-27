'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import type { Registration, Stats } from '../types';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import ContentStudioPage from './ContentStudioPage';
import ContentFormPage from './ContentFormPage';
import OverviewPage from './OverviewPage';
import HomepageBuilder from './HomepageBuilder';
import type { ManagedContent } from './content-studio/types';

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
  onNotice: (message: string) => void;
  editingContent: ManagedContent | null;
  onEditContent: (type: ContentType, item: ManagedContent | null) => void;
};

export default function AdminWorkspace(props: AdminWorkspaceProps) {
  const [activeView, setActiveView] = useState<
    'overview' | 'content-studio' | 'content-form' | 'homepage'
  >('overview');

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
        onHomepage={() => setActiveView('homepage')}
        onRegistrations={showRegistrations}
        onSignOut={props.onSignOut}
      />
      <section className="ml-0 min-h-screen md:ml-[225px]">
        <AdminTopbar activeView={activeView} onSignOut={props.onSignOut} />
        {activeView === 'homepage' ? (
          <HomepageBuilder token={props.token} onNotice={props.onNotice} />
        ) : activeView === 'content-studio' ? (
          <ContentStudioPage
            active={props.active}
            token={props.token}
            onNotice={props.onNotice}
            onEdit={(type, item) => {
              props.onActiveChange(type);
              props.onEditContent(type, item);
              setActiveView('content-form');
            }}
            onOpenForm={(type) => {
              props.onActiveChange(type);
              props.onEditContent(type, null);
              setActiveView('content-form');
            }}
          />
        ) : activeView === 'content-form' ? (
          <ContentFormPage
            {...props}
            initialContent={props.editingContent}
            onBack={() => setActiveView('content-studio')}
          />
        ) : (
          <OverviewPage {...props} />
        )}
      </section>
    </main>
  );
}
