import type { NextRequest } from 'next/server';
import type { RequestBody } from './verify';
import type { Log } from '@/lib/ai';

import { NextResponse } from "next/server";
import { verifyBody } from './verify';
import { createEmbedding, getResponseStream, SYSTEM_PROMPT } from '@/lib/ai';
import { queryRAG, formatQueryResults } from '@/lib/rag';

export async function POST(req: NextRequest) {
    try {
        const dat = (await req.json()) as RequestBody;
        if(!verifyBody(dat)) {
            return new NextResponse('Missing data or data fields in request.', { status: 400 });
        }

        const embeds = await createEmbedding(dat.incoming);
        const q = await queryRAG(embeds);
        const res = formatQueryResults(q);

    const prompt = dat.incoming + res;
    const logs: Log[] = dat.history
        .map(({ role, content }) => {
            return {
                role,
                parts: [{ text: content }]
            } as Log
        })

    logs.push({
        role: 'user',
        parts: [{ text: prompt }]
    })

    const aiStream = await getResponseStream(SYSTEM_PROMPT, logs);
    const stream = new ReadableStream({
        async start(controller) {
            const encode = new TextEncoder();
            try {
                for await (const chunk of aiStream.stream) {
                    const raw = chunk.text();
                    if(raw) {
                        const txt = encode.encode(raw);
                        controller.enqueue(txt);
                    }
                }
            }
            catch(e) {
                controller.error(e);
            }
            finally {
                controller.close();
            }
        }
    })

        return new NextResponse(stream);
    } catch (error: any) {
        console.error('API route error:', error);

        // Return user-friendly error messages
        if (error.message?.includes('Network connection issue') || error.message?.includes('EAI_AGAIN')) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Network connection issue. Please check your internet connection and try again.',
                    details: error.message
                }),
                { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (error.message?.includes('authentication failed')) {
            return new NextResponse(
                JSON.stringify({
                    error: 'Pinecone authentication failed. Please check your API key configuration.',
                    details: error.message
                }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new NextResponse(
            JSON.stringify({
                error: 'An error occurred while processing your request.',
                details: error.message
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}