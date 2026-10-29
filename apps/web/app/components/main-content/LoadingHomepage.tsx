export default function LoadingHomepage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8" aria-busy="true" aria-label="Loading homepage">
      <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="min-h-[440px] rounded-2xl bg-slate-200 md:min-h-[500px] lg:col-span-2" />
        <div className="min-h-[300px] rounded-2xl bg-slate-200" />
      </div>
      <p className="mt-5 text-center text-sm font-medium text-slate-500">Loading…</p>
    </main>
  );
}
