'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  FaFacebookF, 
  FaYoutube, 
  FaLinkedinIn, 
  FaSearch, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  // Live Date and Time Updater
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1e1b4b] text-white text-xs py-2 px-3 sm:px-4 shadow-sm border-b border-[#312e81]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          
          {/* Left Side: Mobile par SIRF LIVE NETWORK dikhega */}
          <div className="flex items-center gap-2 font-medium flex-shrink-0">
            <span className="flex items-center gap-1.5 bg-[#e11d48] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE NETWORK
            </span>
            <span className="text-slate-200 hidden sm:inline">SME TV · Digital Voice of SMEs</span>
          </div>

          {/* Right Side: Timer & Date */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-200 font-medium text-[10px] sm:text-[12px] tracking-wide font-mono">
            {time ? (
              <>
                <span className="text-[#38bdf8] whitespace-nowrap">{time}</span>
                <span className="text-slate-500">•</span>
                <span className="whitespace-nowrap">{date}</span>
              </>
            ) : (
              <span className="opacity-0">Loading...</span>
            )}
          </div>

        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-xl text-[#1e1b4b] hover:text-[#e11d48] focus:outline-none transition-colors p-1"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="hidden lg:flex items-center gap-2.5">
              <a 
                href="https://www.facebook.com/SMEtvIndia/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook" 
                className="w-8 h-8 rounded-full bg-slate-100 text-[#1e1b4b] hover:bg-[#1e1b4b] hover:text-white flex items-center justify-center text-xs transition-all shadow-sm"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://www.youtube.com/@smetvindia" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube" 
                className="w-8 h-8 rounded-full bg-slate-100 text-[#1e1b4b] hover:bg-[#e11d48] hover:text-white flex items-center justify-center text-xs transition-all shadow-sm"
              >
                <FaYoutube />
              </a>
              <a 
                href="https://www.linkedin.com/company/sme-tv/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn" 
                className="w-8 h-8 rounded-full bg-slate-100 text-[#1e1b4b] hover:bg-[#1e1b4b] hover:text-white flex items-center justify-center text-xs transition-all shadow-sm"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Center Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="SME TV home">
            <Image
              src="https://smetv.in/wp-content/uploads/2024/12/smetv-2048x956.png"
              alt="SMEtv Digital Voice of SMEs"
              width={180}
              height={84}
              unoptimized
              priority
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-3">
            <button
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1e1b4b] flex items-center justify-center transition-all text-sm shadow-sm"
              aria-label="Focus search"
              onClick={() => document.getElementById('story-search')?.focus()}
            >
              <FaSearch />
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