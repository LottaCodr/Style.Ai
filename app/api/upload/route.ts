import { NextRequest } from "next/server";
import { CloudinaryUpload } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image || typeof image !== "string") {
            return Response.json({ error: "Invalid image payload" }, { status: 400 });
        }

        const uploadResult = await CloudinaryUpload(image);

        if (!uploadResult?.secure_url) {
            throw new Error("Upload did not return a valid URL");
        }

        return Response.json({ url: uploadResult.secure_url });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json({ error: "Upload failed" }, { status: 500 });
    }
}
