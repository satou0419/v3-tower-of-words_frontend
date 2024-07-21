// pages/tab1/layout.tsx
'use client';

import Head from 'next/head';
import Badges from './Badges';

export const metadata = {
  title: 'Tab 1 Title',
  description: 'Description for Tab 1',
};

export default function LayoutBadges({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <Badges />
      {children}
    </>
  );
}
