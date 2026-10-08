export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <section className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl shadow-smeBlue/10">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-smePink">SME-TV</p>
        <h1 className="text-5xl font-bold text-slate-900">Voice of SMEs</h1>
        <div className="mx-auto my-8 h-1 w-20 rounded-full bg-smeBlue" />
        <p className="text-lg font-semibold text-smeBlue">✓ Web App Connected</p>
        <p className="mt-2 text-slate-500">Phase 1 Setup Successful</p>
      </section>
    </main>
  );
}


  