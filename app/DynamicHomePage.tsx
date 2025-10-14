"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HomePageClient = dynamic(() => import('./HomePageClient'), { ssr: false });

export default function DynamicHomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageClient />
    </Suspense>
  );
}
