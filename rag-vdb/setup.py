from dotenv import load_dotenv
load_dotenv()

from pinecone import Pinecone, ServerlessSpec
import google.generativeai as genai
import os
import json
import time

# Initial Configuration

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

dat_path = os.getenv('REVIEWS_PATH') or 'reviews.json'
raw_dat = json.load(open(dat_path))


# Get embedding dimension from a test embedding
test_res = genai.embed_content(
    model='models/text-embedding-004',
    content="test"
)
embedding_dimension = len(test_res['embedding'])
print(f"Embedding dimension: {embedding_dimension}")

# Pinecone index - check if exists and has correct dimension
try:
    index_info = pc.describe_index("rag")
    existing_dimension = index_info.dimension
    print(f"Existing index dimension: {existing_dimension}")

    if existing_dimension != embedding_dimension:
        print(f"Dimension mismatch! Deleting existing index (dimension {existing_dimension}) and recreating with dimension {embedding_dimension}...")
        pc.delete_index("rag")
        # Wait for deletion to complete
        max_wait = 60  # Maximum 60 seconds
        wait_time = 0
        while wait_time < max_wait:
            try:
                pc.describe_index("rag")
                time.sleep(2)
                wait_time += 2
            except Exception:
                # Index is deleted, break out of loop
                break
        if wait_time >= max_wait:
            print("Warning: Index deletion taking longer than expected. Proceeding anyway...")

        pc.create_index(
            name="rag",
            dimension=embedding_dimension,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        print("Index recreated successfully!")
    else:
        print("Index dimension matches. Using existing index.")
except Exception as e:
    # Index doesn't exist, create it
    print(f"Index doesn't exist or error checking: {e}. Creating new index...")
    pc.create_index(
        name="rag",
        dimension=embedding_dimension,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    print("Index created successfully!")

# Process data
dat = []
for review in raw_dat['reviews']:
    res = genai.embed_content(
        model='models/text-embedding-004',
        content=review['review']
    )

    embedding = res['embedding']
    dat.append({
        "values": embedding,
        "id": review['professor'],
        "metadata": {
            "review": review['review'],
            "subject": review['subject'],
            "stars": review['stars']
        }
    })
# Upsert embeddings into the Pinecone index
index = pc.Index("rag")
upsert_response = index.upsert(
    vectors=dat,
    namespace="ns1",
)

# Print logs
print(f"Upserted count: {upsert_response['upserted_count']}")
print(index.describe_index_stats())