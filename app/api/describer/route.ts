//using GPT-4o Vision

import { openai } from "@/lib/openai";

export async function POST(req: Request) {
    const { imageUrl } = await req.json();

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: "You are a fashion stylist AI that describes clothing in uploaded images"
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Describe this clothing item:"
                    },
                    {
                        type: "image_url",
                        image_url: { url: imageUrl }
                    }

                ]
            }
        ]
    })

    const description = response.choices[0].message.content
}