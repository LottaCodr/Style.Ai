import { NextRequest } from "next/server";
import { CloudinaryUpload } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    const { image } = await req.json();

    if (!image) return Response.json({
        error: 'No image provided'
    }, { status: 400 })

    try {
        const uploadResult = await CloudinaryUpload(image);
        return Response.json({ url: uploadResult.secure_url })

    } catch (error) {
        return Response.json({ error: 'Upload failed' }, { status: 500 })
    }
}