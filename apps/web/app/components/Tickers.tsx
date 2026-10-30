'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type MarketItem = {
  symbol: string;
  name: string;
  value: string;
  change: string;
  isUp: boolean;
};

type Story = {
  id: string;
  slug: string;
  title: string;
};

export default function Tickers({ stories }: { stories: Story[] }) {
  const [marketData, setMarketData] = useState<MarketItem[]>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/market-data');

        if (res.ok) {
          const data = await res.json();

          if (Array.isArray(data) && data.length > 0) {
            setMarketData(data);
          }
        }
      } catch (err) {
        console.error('Error fetching live market ticker:', err);
      }
    };

    fetchMarketData();

    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Market Watch: Right to Left */
        @keyframes ticker {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker 35s linear infinite;
        }

        .animate-ticker:hover {
          animation-play-state: paused;
        }

        /* Breaking News: Left to Right */
        @keyframes ticker-reverse {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-ticker-fast {
          display: flex;
          width: max-content;
          animation: ticker-reverse 25s linear infinite;
        }

        .animate-ticker-fast:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Market Watch Ticker */}
      <div
        className={`${
          marketData.length ? '' : 'hidden'
        } mt-1.5 overflow-hidden border-b border-slate-800 bg-slate-900 py-2.5 text-white`}
        id="market"
      >
        <div className="mx-auto flex max-w-7xl items-center px-4">
          <div className="z-10 flex shrink-0 items-center gap-2 bg-slate-900 pr-4 text-xs font-bold uppercase tracking-wider text-[#e11d48]">
            <span>MARKET WATCH</span>
            <span className="text-slate-600">|</span>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="animate-ticker font-mono text-xs">
              {[1, 2].map((loopKey) => (
                <div
                  key={loopKey}
                  className="flex shrink-0 items-center gap-8 pr-8"
                >
                  {marketData.map((item, index) => (
                    <div
                      key={`${loopKey}-${index}`}
                      className="flex items-center gap-1.5"
                    >
                      <span className="text-slate-400">{item.name}</span>

                      <span className="font-semibold text-white">
                        {item.value}
                      </span>

                      <span
                        className={
                          item.isUp
                            ? 'text-[11px] text-emerald-400'
                            : 'text-[11px] text-rose-400'
                        }
                      >
                        {item.isUp ? '▲' : '▼'} {item.change}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/news"
            className="z-10 hidden shrink-0 bg-slate-900 pl-4 text-[11px] font-bold uppercase tracking-wider text-indigo-300 hover:text-white sm:block"
          >
            Market News →
          </Link>
        </div>
      </div>

      {/* Breaking News Ticker */}
      <div
        className={`${
          stories.length ? '' : 'hidden'
        } overflow-hidden border-b border-rose-100 bg-rose-50/80 py-2.5 text-xs`}
      >
        <div className="mx-auto flex max-w-7xl items-center px-4">
          <span className="z-10 mr-4 shrink-0 rounded bg-[#e11d48] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm">
            BREAKING
          </span>

          <div className="relative w-full overflow-hidden">
            <div className="animate-ticker-fast font-medium text-slate-800">
              {[1, 2].map((loopKey) => (
                <div
                  key={loopKey}
                  className="flex shrink-0 items-center gap-8 pr-8"
                >
                  {stories.map((s) => (
                    <Link
                      href={`/news/${s.slug}`}
                      key={`${loopKey}-${s.id}`}
                      className="flex items-center gap-3 transition-colors hover:text-[#e11d48]"
                    >
                      <span className="font-bold text-[#e11d48]">•</span>
                      <span>{s.title}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
