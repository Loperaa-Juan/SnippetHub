import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse  } from 'ai';
import {DataAPIClient} from "@datastax/astra-db-ts"

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {keyspace: ASTRA_DB_NAMESPACE})

export async function POST(req: Request) {
    try {
        const {messages} = await req.json();
        const latestMessage = messages[messages?.length -1]?.content

        let docContext = ""

        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float"
        });

        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor = collection.find(null, {
                sort: {
                    $vector: embedding.data[0].embedding
                },
                limit: 10
            })

            const documents = await cursor.toArray();

            const docMaps = await documents?.map(doc => doc.text)
            
            docContext = JSON.stringify(docMaps)

        } catch (error) {
            console.log("Error querying db...")
            docContext = ""
        }

        const template = {
            role: "system", 
            content: `
            You are an AI assistant integrated into snippetHub, a platform designed to manage, generate, and edit code snippets for developers. 
            Your name is SnippIA and your job is to help users quickly create, improve, and explain code in a variety of programming languages. 
            Use the provided context to enhance your answers with relevant code patterns, best practices, and short explanations.
                        
            If the context doesn't include enough details, rely on your prior training to infer user needs based on common development patterns.
            Never mention your sources, just deliver accurate and efficient coding assistance.
                        
            Format all responses using markdown where applicable, and prioritize clean, readable code.
            Avoid unnecessary commentary and do not return images.
            ----------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            ----------------
            QUESTION ${latestMessage}
            ----------------
            `
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            stream: true,
            messages: [template, ...messages]
        })

        const stream = OpenAIStream(response as any)
        return new StreamingTextResponse(stream)

    } catch (error) {
        throw error
    }
}