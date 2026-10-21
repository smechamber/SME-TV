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
  
  const [marketData, setMarketData] = useState<MarketItem[]>([
    { symbol: '^NSEI', name: 'NIFTY 50', value: '24,850.15', change: '+0.42%', isUp: true },
    { symbol: '^BSESN', name: 'SENSEX', value: '81,410.20', change: '+0.38%', isUp: true },
    { symbol: 'INR=X', name: 'USD/INR', value: '83.92', change: '-0.05%', isUp: false },
    { symbol: 'GC=F', name: 'GOLD (10g)', value: '76,450.00', change: '+0.22%', isUp: true },
  ]);

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
        .animate-ticker-fast {
          display: flex;
          width: max-content;
          animation: ticker 25s linear infinite;
        }
        .animate-ticker-fast:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Market Watch Ticker */}
      <div className="bg-slate-900 text-white py-2.5 mt-1.5 overflow-hidden border-b border-slate-800" id="market">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <div className="flex items-center gap-2 font-extrabold text-[#e11d48] uppercase tracking-wider text-[11px] flex-shrink-0 z-10 bg-slate-900 pr-4">
            <span>MARKET WATCH</span>
            <span className="text-slate-600">|</span>
          </div>

          <div className="relative overflow-hidden w-full">
            <div className="animate-ticker text-xs font-mono">
              {[1, 2].map((loopKey) => (
                <div key={loopKey} className="flex items-center gap-8 pr-8 flex-shrink-0">
                  {marketData.map((item, index) => (
                    <div key={`${loopKey}-${index}`} className="flex items-center gap-1.5">
                      <span className="text-slate-400">{item.name}</span>
                      <span className="text-white font-semibold">{item.value}</span>
                      <span className={item.isUp ? 'text-emerald-400 text-[11px]' : 'text-rose-400 text-[11px]'}>
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
            className="text-[11px] font-bold text-indigo-300 hover:text-white uppercase tracking-wider flex-shrink-0 z-10 bg-slate-900 pl-4 hidden sm:block"
          >
            Market News →
          </Link>
        </div>
      </div>

      {/* Breaking News Ticker */}
      <div className="bg-rose-50/80 border-b border-rose-100 py-2.5 overflow-hidden text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <span className="font-extrabold text-white bg-[#e11d48] px-3 py-1 rounded text-[10px] tracking-widest uppercase flex-shrink-0 z-10 shadow-sm mr-4">
            BREAKING
          </span>

          <div className="relative overflow-hidden w-full">
            <div className="animate-ticker-fast text-slate-800 font-medium">
              {[1, 2].map((loopKey) => (
                <div key={loopKey} className="flex items-center gap-8 pr-8 flex-shrink-0">
                  {stories.map((s) => (
                    <Link
                      href={`/news/${s.slug}`}
                      key={`${loopKey}-${s.id}`}
                      className="hover:text-[#e11d48] transition-colors flex items-center gap-3"
                    >
                      <span className="text-[#e11d48] font-bold">•</span>
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