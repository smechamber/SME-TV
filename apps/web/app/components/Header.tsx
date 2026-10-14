'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1e1b4b] text-white text-xs py-2 px-4 shadow-sm border-b border-[#312e81]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1.5 bg-[#e11d48] text-white text-[10px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE NETWORK
            </span>
            <span className="text-slate-200">SME TV · Digital Voice of SMEs</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300 text-[11px] font-semibold tracking-wider uppercase">
            <span>MSME</span>
            <span className="text-[#e11d48]">•</span>
            <span>POLICY</span>
            <span className="text-[#e11d48]">•</span>
            <span>FINANCE</span>
            <span className="text-[#e11d48]">•</span>
            <span>EXPORTS</span>
            <span className="text-[#e11d48]">•</span>
            <span>STARTUPS</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl text-[#1e1b4b] hover:text-[#e11d48] focus:outline-none transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <a href="https://www.facebook.com/SMEtvIndia/" aria-label="Facebook" className="w-8 h-8 rounded-full bg-slate-100 text-[#1e1b4b] hover:bg-[#1e1b4b] hover:text-white flex items-center justify-center font-bold text-xs transition-all">
                f
              </a>
              <a href="https://www.youtube.com/@smetvindia" aria-label="YouTube" className="w-8 h-8 rounded-full bg-slate-100 text-[#1e1b4b] hover:bg-[#e11d48] hover:text-white flex items-center justify-center text-xs transition-all">
                ▶
              </a>
              <a href="https://www.linkedin.com/company/sme-tv/" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-slate-100 text-[#1e1b4b] hover:bg-[#1e1b4b] hover:text-white flex items-center justify-center font-bold text-xs transition-all">
                in
              </a>
            </div>
          </div>

          <Link href="/" className="flex-shrink-0" aria-label="SME TV home">
            <Image
              src="https://smetv.in/wp-content/uploads/2024/12/smetv-2048x956.png"
              alt="SMEtv Digital Voice of SMEs"
              width={160}
              height={75}
              unoptimized
              className="h-11 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1e1b4b] flex items-center justify-center transition-all text-lg font-bold"
              aria-label="Focus search"
              onClick={() => document.getElementById('story-search')?.focus()}
            >
              ⌕
            </button>
            <Link href="/register" className="hidden sm:inline-flex px-5 py-2.5 rounded-lg bg-[#1e1b4b] hover:bg-[#2e2a72] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md">
              Subscribe
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className={`bg-white border-b border-slate-200 shadow-sm md:block ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between py-2 md:py-0 overflow-x-auto scrollbar-none">
          <div className="flex flex-col md:flex-row md:items-center gap-1">
            {[
              ['Home', '/'],
              ['News', '/news'],
              ['Markets', '#market'],
              ['Videos', '/videos'],
              ['Events', '/events'],
              ['Business', '/news'],
              ['Finance', '/news'],
              ['Startups', '/news'],
              ['About', '/about'],
            ].map(([label, href], i) => (
              <Link
                key={label}
                className={`text-xs font-bold uppercase tracking-wider transition-all py-3 px-3 rounded-md hover:text-[#e11d48] ${
                  i === 0 ? 'text-[#e11d48] border-b-2 border-[#e11d48]' : 'text-slate-700'
                }`}
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}