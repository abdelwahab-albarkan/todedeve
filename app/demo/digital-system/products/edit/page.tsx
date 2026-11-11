'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductEditor } from '@/components/digital-system/ProductEditor';

function Edit() {
  const id = useSearchParams()?.get('id') ?? '';
  // key: remount the editor when switching between products
  return <ProductEditor key={id} productId={id} />;
}

export default function EditProductPage() {
  return (
    <React.Suspense fallback={null}>
      <Edit />
    </React.Suspense>
  );
}
