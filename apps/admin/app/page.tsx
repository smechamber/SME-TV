const cards = ['Videos', 'Users', 'Views', 'Comments'];
export default function AdminPage() {
  return <main className="min-h-screen bg-cream p-8 md:p-14"><h1 className="text-4xl font-bold text-slate-900">SME-TV Admin</h1><p className="mt-2 text-smeBlue">Phase 1 Setup Successful</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{cards.map((card) => <div className="rounded-2xl bg-white p-6 shadow-lg shadow-smePink/10" key={card}><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{card}</p><p className="mt-5 text-4xl font-bold text-smePink">—</p></div>)}</div></main>;
}
