"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

export default function UploadForm({
    onResult,
}: {
    onResult: (data: { url: string; description: string }) => void;
}) {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError(null);
        setImage(file || null);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleUpload = async () => {
        if (!image) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            setLoading(true);
            setError(null);

            try {
                const uploadRes = await axios.post("/api/upload", {
                    image: reader.result,
                });

                const imageUrl = uploadRes.data.url;

                const descRes = await axios.post("/api/describer", {
                    imageUrl,
                });

                onResult({ url: imageUrl, description: descRes.data.description });
            } catch (err: any) {
                console.error("Error:", err);
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        reader.readAsDataURL(image);
    };

    return (
        <div className="max-w-md w-full mx-auto space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-all">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Upload an Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-100 file:text-purple-700
            hover:file:bg-purple-200 transition"
                />
                {preview && (
                    <div className="mt-4">
                        <Image
                            src={preview}
                            alt="Preview"
                            width={400}
                            height={300}
                            className="rounded-lg border object-contain max-h-60 w-full"
                        />
                    </div>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={loading || !image}
                className={clsx(
                    "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition",
                    loading
                        ? "bg-purple-500/70 cursor-not-allowed"
                        : "bg-purple-700 hover:bg-purple-800"
                )}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Analyzing...
                    </>
                ) : (
                    <>
                        <UploadCloud className="h-5 w-5" /> Upload & Describe
                    </>
                )}
            </button>

            {error && (
                <p className="text-sm text-red-600 text-center animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
}
