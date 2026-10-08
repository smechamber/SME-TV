import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SME-TV', description: 'Voice of SMEs' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
