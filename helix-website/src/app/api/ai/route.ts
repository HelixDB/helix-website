import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { prompt, currentQuery } = await request.json();

        const systemPrompt = `TODO`;

        const userPrompt = currentQuery 
            ? `Current query:\n${currentQuery}\n\nGenerate a new query based on this request: ${prompt}`
            : `Generate a query that does the following: ${prompt}`;

        const message = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            temperature: 0.7,
            messages: [
                { role: 'user', content: systemPrompt },
                { role: 'assistant', content: "I understand. I will generate HelixQL queries following the syntax and patterns you described." },
                { role: 'user', content: userPrompt }
            ],
        });

        // Get the generated query from the response
        if (!message.content[0] || !('text' in message.content[0])) {
            throw new Error('Unexpected response format from Claude');
        }

        const generatedQuery = message.content[0].text;

        return NextResponse.json({ query: generatedQuery });
    } catch (error) {
        console.error('Error calling Claude:', error);
        return NextResponse.json(
            { error: 'Failed to generate query' },
            { status: 500 }
        );
    }
} 