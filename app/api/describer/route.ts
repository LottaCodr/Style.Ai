import { openai } from "@/lib/openai";

export async function POST(req: Request) {
    const { imageUrl } = await req.json();

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a fashion stylist AI that describes clothing in uploaded images.",
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Describe this clothing item:",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
        });

        const message = response.choices?.[0]?.message?.content;

        if (!message) {
            return Response.json({ error: "Empty response from OpenAI" }, { status: 502 });
        }

        return Response.json({ description: message });
    } catch (error: any) {
        console.error("OpenAI error:", error);
        return Response.json({ error: "Description failed" }, { status: 500 });
    }
}
