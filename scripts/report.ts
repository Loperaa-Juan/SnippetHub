import OpenAI from "openai"

import "dotenv/config"

const {
    NEXT_PUBLIC_OPENAI_API_KEY
} = process.env;

const client = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true});

export const report_interpreter = async(stats) => {

    const barras = await client.responses.create({
        model: "gpt-4.1-nano",
        input: `Actúa como un analista de datos experto y objetivo. A continuación, te proporcionaré datos destinados a una gráfica de barras (o la descripción de una). Tu tarea es realizar un análisis conciso y altamente profesional de la información que esta gráfica representaría, destacando:

            1.  **Comparaciones Clave:** Las diferencias más notables en magnitud entre las categorías/barras.
            2.  **Valores Dominantes/Mínimos:** Qué categorías destacan por tener los valores más altos o más bajos.
            3.  **Patrones o Distribución:** Cualquier patrón visible en la distribución de los valores a través de las categorías.
            4.  **Insights Relevantes:** Conclusiones o implicaciones importantes que se puedan inferir de las comparaciones visuales que ofrecería la gráfica.

            Presenta tus hallazgos en **párrafos cortos**, de manera estructurada, clara y con un lenguaje formal y preciso, como si estuvieras explicando la composición del total a una audiencia ejecutiva. Evita especulaciones no fundamentadas en los datos proporcionados.
            
            **No utilices formato markdown para el énfasis (por ejemplo, no uses asteriscos para negritas como **texto**); presenta todo el análisis en texto plano.** Evita especulaciones sobre los datos.

            ESTADISTICAS: ${JSON.stringify(stats)}`,
    });

    const torta = await client.responses.create({
        model: "gpt-4.1-nano",
        input: `Actúa como un analista de datos experto y objetivo. Con los datos que te daré para una gráfica de barras, realiza un análisis conciso y muy profesional.
            Enfócate en:

            1.  **Comparaciones Clave:** Diferencias notables de magnitud entre categorías/barras.
            2.  **Valores Dominantes/Mínimos:** Categorías con valores más altos o bajos.
            3.  **Patrones o Distribución:** Patrones visibles en los valores entre categorías.
            4.  **Insights Relevantes:** Conclusiones importantes de las comparaciones visuales.

            Presenta los hallazgos en **cuatro párrafos cortos**, de forma estructurada, clara, formal y precisa para ejecutivos. Sin especulaciones sobre los datos. 
            
            **No utilices formato markdown para el énfasis (por ejemplo, no uses asteriscos para negritas como **texto**); presenta todo el análisis en texto plano.** Evita especulaciones sobre los datos.

            ESTADISTICAS: ${JSON.stringify(stats)}`
    });

    const analitics_barras = barras.output_text
    const analitics_torta = torta.output_text

    return {
        "barras": analitics_barras,
        "torta": analitics_torta
    }
}

