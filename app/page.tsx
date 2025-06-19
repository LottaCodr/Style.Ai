"use client";

import Closet from "@/components/closet";
import UploadForm from "@/components/upload-form";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [wardrobe, setWardrobe] = useState<
    { url: string; description: string }[]
  >([]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex justify-center items-center gap-2">
            <Sparkles className="text-purple-600 w-7 h-7" />
            Wardrobe AI Stylist
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            Upload an outfit and let AI describe it. Curate your personal closet
            in style.
          </p>
        </header>

        {/* Upload Form */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <UploadForm
            onResult={(data) => setWardrobe((prev) => [...prev, data])}
          />
        </section>

        {/* Closet Viewer */}
        {wardrobe.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Your AI-Enhanced Closet
            </h2>
            <Closet wardrobe={wardrobe} />
          </section>
        )}
      </div>
    </main>
  );
}
