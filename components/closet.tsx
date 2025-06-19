"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Sparkles, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Closet({
    wardrobe,
}: {
    wardrobe: { url: string; description: string }[];
}) {
    const [selected, setSelected] = useState<number[]>([]);
    const [suggestion, setSuggestion] = useState("");
    const [loading, setLoading] = useState(false);

    const toggle = (i: number) =>
        setSelected((prev) =>
            prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
        );

    const getSuggestion = async () => {
        if (selected.length === 0) {
            toast.error("Select at least one item to get a suggestion.");
            return;
        }

        const items = selected.map((i) => wardrobe[i].description);
        setLoading(true);
        toast.loading("Generating outfit...", { id: "loading-toast" });

        try {
            const res = await fetch("/api/stylist", {
                method: "POST",
                body: JSON.stringify({ items }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setSuggestion(data.suggestion);
            toast.success("Outfit suggestion ready!", { id: "loading-toast" });
        } catch (error) {
            toast.error("Failed to generate suggestion.", { id: "loading-toast" });
            setSuggestion("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-6">
                {/* Grid of wardrobe items */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wardrobe.map((item, idx) => {
                        const isSelected = selected.includes(idx);

                        return (
                            <motion.div
                                layout
                                key={idx}
                                onClick={() => toggle(idx)}
                                className={clsx(
                                    "relative p-2 rounded-xl border group transition cursor-pointer bg-white shadow-sm hover:shadow-md",
                                    isSelected
                                        ? "border-purple-600 ring-2 ring-purple-300"
                                        : "border-gray-200"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div
                                    layout
                                    initial={{ opacity: 0.6 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                        src={item.url}
                                        alt={`Wardrobe item ${idx}`}
                                        width={300}
                                        height={300}
                                        className="rounded-md object-cover w-full h-48"
                                    />
                                    <p className="mt-3 text-sm text-gray-700">{item.description}</p>
                                </motion.div>

                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            className="absolute top-2 right-2 text-green-600"
                                        >
                                            <CheckCircle2 className="w-6 h-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Action Button */}
                <div className="text-center">
                    <button
                        onClick={getSuggestion}
                        disabled={selected.length === 0 || loading}
                        className={clsx(
                            "inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition",
                            selected.length === 0 || loading
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        )}
                    >
                        <Sparkles className="w-5 h-5" />
                        {loading ? "Analyzing..." : "Suggest Outfit"}
                    </button>
                </div>

                {/* AI Suggestion Output */}
                {suggestion && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap"
                    >
                        {suggestion}
                    </motion.div>
                )}
            </div>
        </>
    );
}
