import type { QueryResponse } from "@pinecone-database/pinecone";
import type { Embedding } from "./ai";

import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";

export type RAGMetadata = {
    review: string,
    subject: string,
    stars: number
}

const apiKey = process.env.PINECONE_API_KEY || '';

if (!apiKey) {
    console.error('PINECONE_API_KEY is not set in environment variables');
}

export const pc = new Pinecone({
    apiKey: apiKey
});

const index = pc.index('rag').namespace('ns1');

export async function queryRAG(embeding: Embedding[], k?: number) {
    try {
        return await index.query({
            topK: k || 5,
            includeMetadata: true,
            vector: embeding
        });
    } catch (error: any) {
        console.error('Pinecone query error:', error);

        // Provide more helpful error messages
        if (error.message?.includes('EAI_AGAIN') || error.message?.includes('getaddrinfo')) {
            throw new Error('Network connection issue: Cannot resolve Pinecone API hostname. Please check your internet connection and DNS settings.');
        }

        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            throw new Error('Pinecone authentication failed: Please check your PINECONE_API_KEY.');
        }

        throw error;
    }
}

export function formatQueryResults(q: QueryResponse<RecordMetadata>) {
    return q.matches
        .map(({ id, metadata }) => {
            if(!metadata) {
                console.warn(`Missing metadata for ${id}`);
                return '';
            }
            const dat = metadata as RAGMetadata;

            return `
            Returned Results:
            Professor: ${id}
            Review: ${ dat.review }
            Subject: ${ dat.subject }
            Stars: ${ dat.stars }
            \n\n
            `
        })
        .join('');
}