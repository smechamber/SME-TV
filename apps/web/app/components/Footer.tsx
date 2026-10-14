'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer className="bg-[#0f172a] text-slate-400 border-t border-slate-800 py-12 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
          <Link href="/">
            <Image
              src="https://smetv.in/wp-content/uploads/2024/12/smetv-2048x956.png"
              alt="SMEtv"
              width={150}
              height={70}
              unoptimized
              className="h-10 w-auto object-contain filter brightness-200"
            />
          </Link>
          <p className="max-w-md text-slate-400 leading-relaxed">
            SME TV is India’s premier digital news platform dedicated to micro, small, and medium enterprises, startups, and economic growth stories.
          </p>
          <div className="flex flex-wrap justify-center gap-6 font-bold uppercase tracking-wider text-slate-300">
            <Link href="/about" className="hover:text-[#e11d48] transition-colors">About Us</Link>
            <Link href="/news" className="hover:text-[#e11d48] transition-colors">Editorial</Link>
            <Link href="/events" className="hover:text-[#e11d48] transition-colors">Events</Link>
            <Link href="/videos" className="hover:text-[#e11d48] transition-colors">Videos</Link>
            <Link href="/about" className="hover:text-[#e11d48] transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-[#e11d48] transition-colors">Sign In</Link>
          </div>
          <small className="text-slate-500">© {new Date().getFullYear()} SME TV Network. All rights reserved.</small>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-2 z-50 text-[10px] font-bold uppercase tracking-wider shadow-lg">
        <Link className="flex flex-col items-center gap-0.5 text-[#e11d48]" href="/">
          <span className="text-base">⌂</span><span>Home</span>
        </Link>
        <Link href="/news" className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#e11d48]">
          <span className="text-base">▤</span><span>News</span>
        </Link>
        <Link href="/videos" className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#e11d48]">
          <span className="text-base">▶</span><span>Watch</span>
        </Link>
        <Link href="#market" className="flex flex-col items-center gap-0.5 text-slate-600 hover:text-[#e11d48]">
          <span className="text-base">⌁</span><span>Markets</span>
        </Link>
      </nav>
    </>
  );
}