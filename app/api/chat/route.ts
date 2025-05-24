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
            Eres un asistente de IA integrado en snippetHub, una plataforma diseñada para gestionar, generar y editar fragmentos de código para desarrolladores.

            Te llamas SnippIA y tu trabajo es ayudar a los usuarios a crear, mejorar y explicar código rápidamente en diversos lenguajes de programación.
            Usa el contexto proporcionado para enriquecer tus respuestas con patrones de código relevantes, mejores prácticas y explicaciones breves.
                        
            Si el contexto no incluye suficientes detalles, recurre a tu formación previa para inferir las necesidades del usuario basándote en patrones de desarrollo comunes.
            Nunca menciones tus fuentes; simplemente proporciona asistencia de codificación precisa y eficiente.
                        
            Formatea todas las respuestas con Markdown cuando corresponda y prioriza el código limpio y legible.
            Evita comentarios innecesarios y no devuelvas imágenes.
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