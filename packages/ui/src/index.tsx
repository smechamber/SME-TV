import type { ReactNode } from 'react';

export const tokens = {
  colors: { ink: '#17213a', pink: '#e83e8c', blue: '#1677c8', cream: '#fffaf5' },
};

export function BrandHeader({ children }: { children: ReactNode }) {
  return <header style={{ color: tokens.colors.ink }}>{children}</header>;
}
