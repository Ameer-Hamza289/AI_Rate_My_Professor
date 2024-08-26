This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

 Install node js and npm 
 create nextjs project
 
 ## Installing additional dependencies: 

 ## We’ll need to install Material-UI, Pinecone, and other necessary packages. Run the following command in your project directory:

npm install @mui/material @emotion/react @emotion/styled @pinecone-database/pinecone @vercel/analytics openai
## Setting up Pinecone:

Go to the Pinecone website and create an account if you haven’t already.
Create a new project and note down your API key and environment.
We’ll use these in the next step.

## Setting up OpenAI:
 Go to the OpenAI website and sign up for an account if you haven’t already.
 Navigate to the API section and create a new API key.
 We’ll use this API key in the next step.

you can also use the gemini api key 

## Creating an environment variables file:

Create a new file in your project’s root directory called `.env.local` and add the following code, replacing the placeholder values with your actual Pinecone and OpenAI details:

PINECONE_API_KEY=your_pinecone_api_key
OPENAI_API_KEY=your_openai_api_key

With these steps completed, we’ve successfully set up our development environment and project structure for the Rate My Professor AI Assistant

## Setting Up the Vector Database

Before we dive into building our Rate My Professor AI Assistant, we need to prepare our data and set up our vector database.
Let’s walk through this setup process step-by-step, starting with our Python environment and ending with a populated Pinecone index ready for use in our application.

##  Set up a Python environment:
First, make sure you have Python installed. Then, create a new directory for your project and set up a miniconda environment:(you cal also set up virtual environment )
mkdir rmp-ai-assistant-python
cd rmp-ai-assistant-python

## for virtual environment

python -m venv venv   

## for miniconda environment

Follow these steps to set up your Python environment using Miniconda:

Install Miniconda: If you haven't already, download and install Miniconda from the official website.

## Create a New Conda Environment:

Open your terminal or command prompt and run the following commands:

conda create --name rate-my-professor-env python=3.9
conda activate rate-my-professor-env
## Install required packages

pip install python-dotenv pinecone-client openai

## Create a `.env` file:
In your project root, create a file named `.env` and add your API keys:

PINECONE_API_KEY=your_pinecone_api_key
OPENAI_API_KEY=your_openai_api_key

## Create a Python script:

Create a new file named `setup_rag.py` and add the following code:

from dotenv import load_dotenv
load_dotenv()
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import os
import json

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Create a Pinecone index
pc.create_index(
    name="rag",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)

# Load the review data
data = json.load(open("reviews.json"))

processed_data = []
client = OpenAI()

# Create embeddings for each review
for review in data["reviews"]:
    response = client.embeddings.create(
        input=review['review'], model="text-embedding-3-small"
    )
    embedding = response.data[0].embedding
    processed_data.append(
        {
            "values": embedding,
            "id": review["professor"],
            "metadata":{
                "review": review["review"],
                "subject": review["subject"],
                "stars": review["stars"],
            }
        }
    )

# Insert the embeddings into the Pinecone index
index = pc.Index("rag")
upsert_response = index.upsert(
    vectors=processed_data,
    namespace="ns1",
)
print(f"Upserted count: {upsert_response ['upserted_count'] }")

# Print index statistics
print(index.describe_index_stats())

## Prepare the review data:
Create a file named `reviews.json` in the same directory with your review data. The structure should be:

{
  "reviews": [
  
    {
      "professor": "Prof1",
      "review": "Great professor...",
      "subject": "Math",
      "stars": 5
    },
    // ... more reviews ...
  ]
}
## Run the script:

Execute the Python script:

python setup_rag.py

## run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
