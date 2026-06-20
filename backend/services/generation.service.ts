import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from '../config/systemPrompt';

function shouldFallbackToGroq(error: unknown): boolean {
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        return (
            msg.includes('quota') ||
            msg.includes('rate limit') ||
            msg.includes('resource_exhausted') ||
            msg.includes('429') ||
            msg.includes('503') ||
            msg.includes('unavailable') ||
            msg.includes('overloaded') ||
            msg.includes('high demand') ||
            msg.includes('service unavailable')
        );
    }
    if (typeof error === 'object' && error !== null) {
        const err = error as Record<string, unknown>;
        return (
            err['status'] === 429 ||
            err['status'] === 503 ||
            err['code'] === 'RESOURCE_EXHAUSTED' ||
            err['code'] === 'UNAVAILABLE'
        );
    }
    return false;
}

async function* generateWithGroq(prompt: string, currentCode?: string) {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
        throw new Error('GROQ_API_KEY is not set — cannot fall back to Groq.');
    }

    const groq = new Groq({ apiKey: groqApiKey });
    const stream = await groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
                role: 'user',
                content: currentCode
                    ? `Current code:\n${currentCode}\n\nUser request: ${prompt}`
                    : prompt
            },
        ],
        temperature: 0.2,
        max_tokens: 8192,
        stream: true,
    });

    for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) yield text;
    }
}

export async function* generateCode(prompt: string, currentCode?: string, API?: string) {
    const apiKey = API || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("API key not provided!")
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
        const responceStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: currentCode
                ? `Current code:\n${currentCode}\n\nUser request: ${prompt}`
                : prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.2,
                maxOutputTokens: 8192
            },
        });

        for await (const chunk of responceStream) {
            yield chunk.text;
        }
    } catch (error: unknown) {
        if (shouldFallbackToGroq(error)) {
            console.warn('[generation.service] Gemini unavailable — switching to Groq fallback.');
            yield* generateWithGroq(prompt, currentCode);
        } else {
            throw error;
        }
    }
}