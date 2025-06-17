"use client"

import { useState } from 'react'
import axios from 'axios'

export default function UploadForm({ onResult }: { onResult: (data: { url: string, description: string }) => void }) {
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleUpload = async () => {
        if (!image) return;

        const reader = new FileReader()
        reader.onloadend = async () => {
            setLoading(true)

            try {
                const uploadRes = await axios.post('/api/upload', { image: reader.result })
                const imageUrl = uploadRes.data.url;
                const descRes = await axios.post('/api/describer', { imageUrl })

                onResult({ url: imageUrl, description: descRes.data.description })

            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        reader.readAsDataURL(image)
    }

    return (
        <div className='space-y-4'>
            <input type='file' accept='image/*' onChange={(e) => setImage(e.target.files?.[0] || null)} />
            <button onClick={handleUpload} disabled={loading} className='bg-purple-700 text-white px-4 py-2 rounded' />

            {loading ? 'Analyzing...' : "Upload & Describe"}
        </div>
    )
}