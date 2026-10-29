export default function SubscribeBanner() {
  return (
    <section className="flex flex-col items-center justify-between gap-8 rounded-2xl bg-gradient-to-r from-[#1e1b4b] to-[#2e2a72] p-8 text-white shadow-xl md:p-12 lg:flex-row">
      <div className="max-w-xl space-y-4">
        <span className="rounded bg-[#e11d48] px-3 py-1 text-[10px] font-black uppercase tracking-widest">
          SME TV DIRECT
        </span>
        <h2 className="text-3xl font-extrabold leading-tight">
          Stay ahead of business policies &amp; market intelligence.
        </h2>
        <p className="text-sm text-slate-300">
          Get daily headlines, policy breakdowns, and exclusive founder interviews delivered
          straight to your inbox.
        </p>
        <div className="flex max-w-md items-center gap-3 pt-2">
          <input
            type="email"
            placeholder="Enter your business email..."
            className="w-full rounded-lg px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none"
          />
          <button className="flex-shrink-0 rounded-lg bg-[#e11d48] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-rose-600">
            Join Free
          </button>
        </div>
      </div>
      <div className="hidden h-80 w-44 flex-col justify-between rounded-3xl border-4 border-slate-700 bg-slate-950 p-4 shadow-2xl sm:flex">
        <b className="text-center text-xs font-black tracking-wider text-[#e11d48]">
          SME<span className="text-white">tv</span>
        </b>
        <div className="h-20 w-full rounded-xl border border-slate-800 bg-slate-900" />
        <div className="space-y-1.5">
          <i className="block h-2 w-full rounded bg-slate-800" />
          <i className="block h-2 w-3/4 rounded bg-slate-800" />
          <i className="block h-2 w-1/2 rounded bg-[#e11d48]" />
        </div>
        <div className="text-center text-xs font-bold text-emerald-400">SME TV Updates</div>
      </div>
    </section>
  );
}
