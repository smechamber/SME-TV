type AdminTopbarProps = {
  activeView: 'overview' | 'content-studio';
  onSignOut: () => void;
};

export default function AdminTopbar({ activeView, onSignOut }: AdminTopbarProps) {
  return (
    <header className="flex h-[58px] items-center justify-between border-b border-[#ebe8ef] bg-white px-[17px] text-[11px] font-bold md:px-[34px]">
      <span>
        SME TV <span className="font-normal text-[#9993a1]">/ {activeView === 'overview' ? 'Overview' : 'Content studio'}</span>
      </span>
      <button className="text-[#777283]" onClick={onSignOut}>Sign out</button>
    </header>
  );
}
