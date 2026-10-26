'use client';

type AdminSidebarProps = {
  activeView: 'overview' | 'content-studio' | 'content-form' | 'homepage';
  onOverview: () => void;
  onContentStudio: () => void;
  onHomepage: () => void;
  onRegistrations: () => void;
  onSignOut: () => void;
};

export default function AdminSidebar({
  activeView,
  onOverview,
  onContentStudio,
  onHomepage,
  onRegistrations,
  onSignOut,
}: AdminSidebarProps) {
  const itemClass = (selected = false) =>
    `w-full rounded px-3 py-3 text-left text-xs transition ${
      selected ? 'bg-white/10 text-white' : 'text-[#c8c3ce] hover:bg-white/10 hover:text-white'
    }`;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-[225px] flex-col bg-[#221b30] px-[17px] py-6 text-white md:flex">
      <a className="px-2 pb-9 text-[29px] font-black tracking-[-1.7px] text-[#d92867]" href="/">
        SME<span className="text-[#542c71]">TV</span>
      </a>
      <span className="px-2 pb-2 text-[9px] font-bold tracking-[.14em] text-[#a8a1b1]">WORKSPACE</span>
      <button className={itemClass(activeView === 'overview')} onClick={onOverview}>Overview</button>
      <button className={itemClass(activeView === 'content-studio' || activeView === 'content-form')} onClick={onContentStudio}>Content studio</button>
      <button className={itemClass(activeView === 'homepage')} onClick={onHomepage}>Homepage builder</button>
      <button className={itemClass()} onClick={onRegistrations}>Registrations</button>
      <div className="mt-auto flex items-center gap-2 border-t border-white/10 px-1 pt-4">
        <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#ad4275] text-xs font-bold">A</span>
        <span className="grid gap-1 text-[10px]">
          <strong>Administrator</strong>
          <small className="text-[#aaa4b2]">SME TV newsroom</small>
        </span>
        <button className="ml-auto text-lg text-white" onClick={onSignOut} aria-label="Sign out">×</button>
      </div>
    </aside>
  );
}
