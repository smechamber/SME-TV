import './globals.css';
import type { Metadata } from 'next';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'SMEtv — Voice of SMEs',
  description: 'Business news, markets, videos and events for India’s SME community.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="scroll-smooth motion-reduce:scroll-auto"><body className="flex min-h-screen flex-col bg-white font-[Arial,Helvetica,sans-serif] text-[#1b1930] antialiased">
    <Header />
    <div className="flex-1">{children}</div>
    <Footer />
  </body></html>;
}
