import { openai } from '@/lib/openai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const { items } = await req.json()
    const prompt = `You are a fashion stylist. Based on these clothing items:\n\n${items.map((i: string, idx: number) => `${idx + i}.${i}`).join('\n')}\n\n Suggest an outfit name, a styling tip, occasion, and accessories.`

    try {
        const res = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{
                role: 'user',
                content: prompt
            }]
        })

        return Response.json({
            suggestion: res.choices[0].message.content
        })
    } catch (error) {
        return Response.json({ error: 'Styling failed' }, { status: 500 })
    }
}
