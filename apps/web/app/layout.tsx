import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SMEtv — Voice of SMEs', description: 'Business news, markets, videos and events for India’s SME community.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
