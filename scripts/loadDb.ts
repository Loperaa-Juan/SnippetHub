import {DataAPIClient} from "@datastax/astra-db-ts";

import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import OpenAI from "openai"

import "dotenv/config"

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

// cargamos nuestras variables de entorno
const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    NEXT_PUBLIC_OPENAI_API_KEY
} = process.env;

// Empezamos a conectarnos con OpenAI y le pasamos nuestra api key
const openai = new OpenAI( { apiKey: NEXT_PUBLIC_OPENAI_API_KEY } )

// Definimos la fuente de la data para el RAG
const snippIAData = [
    'https://documentation-snippethub.netlify.app/',
    'https://sebasweb.net/code-snippets/',
    'https://es.wikipedia.org/wiki/Snippet',
    'https://www.datacamp.com/es/tutorial/coding-best-practices-and-guidelines',
    'https://jonathanvelez.com/que-es-snippet/'
]

// Empezamos a conectarnos con la base de datos datastax
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {keyspace: ASTRA_DB_NAMESPACE})

// Dividimos la información en fragmentos
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})

// Creamos una colección en la base de datos
const createCollection = async (SimilarityMetric: SimilarityMetric = "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536,
            metric: SimilarityMetric
        }
    })
    console.log(res)
}

// Cargamos la data desde los links para crear embeddings y poner la info en nuestra base de datos vectorial
const LoadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION);

    for await (const url of snippIAData) {
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);

        for await ( const chunk of chunks ) {
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
            })

            const vector = embedding.data[0].embedding

            const res = await collection.insertOne({
                $vector: vector,
                text: chunk
            })

            console.log(res)
        }
    }
}

// Creamos la función para hacer web scrapping
const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate( () => document.body.innerHTML )
            await browser.close()
            return result
        }
    })

    return ( await loader.scrape() )?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => LoadSampleData())