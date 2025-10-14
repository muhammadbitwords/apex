"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CarsPageClient = dynamic(() => import('./CarsPageClient'), { ssr: false });

export default function DynamicCarsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsPageClient />
    </Suspense>
  );
}
