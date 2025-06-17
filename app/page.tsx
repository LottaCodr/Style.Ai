'use client';
import Closet from '@/components/closet';
import UploadForm from '@/components/upload-form';
import { useState } from 'react';


export default function Home() {
  const [wardrobe, setWardrobe] = useState<{ url: string; description: string }[]>([]);
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Wardrobe AI Stylist</h1>
      <UploadForm onResult={(data) => setWardrobe(prev => [...prev, data])} />
      {wardrobe.length > 0 && <Closet wardrobe={wardrobe} />}
    </main>
  );
}