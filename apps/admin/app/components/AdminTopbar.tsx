type AdminTopbarProps = {
  activeView:
    | 'overview'
    | 'content-studio'
    | 'content-form'
    | 'homepage'
    | 'news-page-builder'
    | 'videos-page-builder'
    | 'advertising';
  onSignOut: () => void;
};

export default function AdminTopbar({ activeView, onSignOut }: AdminTopbarProps) {
  const viewName =
    activeView === 'overview'
      ? 'Overview'
      : activeView === 'content-form'
        ? 'Create content'
        : activeView === 'homepage'
          ? 'Homepage'
          : activeView === 'news-page-builder'
            ? 'News Page Builder'
            : activeView === 'videos-page-builder'
              ? 'Videos Page Builder'
              : activeView === 'advertising'
                ? 'Advertising'
                : 'Content studio';

  return (
    <header className="flex h-[58px] items-center justify-between border-b border-[#ebe8ef] bg-white px-[17px] text-[11px] font-bold md:px-[34px]">
      <span>
        SME TV <span className="font-normal text-[#9993a1]">/ {viewName}</span>
      </span>
      <button className="text-[#777283]" onClick={onSignOut}>Sign out</button>
    </header>
  );
}
