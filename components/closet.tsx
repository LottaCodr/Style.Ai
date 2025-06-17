'use client';
import { useState } from 'react';
export default function Closet({ wardrobe }: { wardrobe: { url: string; description: string }[] }) {
    const [selected, setSelected] = useState<number[]>([]);
    const [suggestion, setSuggestion] = useState('');
    const toggle = (i: number) => setSelected((prev) => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

    const getSuggestion = async () => {
        const items = selected.map(i => wardrobe[i].description);
        const res = await fetch('/api/stylist', {
            method: 'POST',
            body: JSON.stringify({ items }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setSuggestion(data.suggestion);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {wardrobe.map((item, idx) => (
                    <div key={idx} onClick={() => toggle(idx)} className={`p-2 border rounded cursor-pointer ${selected.includes(idx) ? 'border-blue-500' : 'border-gray-300'}`}>
                        <img src={item.url} alt={`Item ${idx}`} className="rounded" />
                        <p className="text-sm mt-2">{item.description}</p>
                    </div>
                ))}
            </div>
            <button onClick={getSuggestion} className="bg-green-500 text-white px-4 py-2 rounded">Suggest Outfit</button>
            {suggestion && <p className="mt-4 whitespace-pre-wrap">{suggestion}</p>}
        </div>
    );
}

