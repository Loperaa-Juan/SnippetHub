import "../../globals.css"
import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionRow = ({onPromptClick}) => {
    
    const prompts = [
        "¿Qué es un Snippet?",
        "¿Cómo hago una petición con autenticación por token?",
        "Genera un hook de React para detectar si el usuario está en modo oscuro.",
        "¿Cómo se usa Axios para hacer un POST?",
        "¿Cómo configuro una conexión a PostgreSQL con SQLAlchemy?",
        "¿Cómo puedo crear una ruta en flask?",
        "Crea un snippet reutilizable para conexión a base de datos PostgreSQL.",
        "¿Cómo centro un div vertical y horizontalmente con Tailwind?"
    ]

    return(
        <div className="prompt-suggestion-row">
            {prompts.map( (prompt, index) => <PromptSuggestionButton 
            key={`suggestion-${index}`} 
            text={prompt}
            onClick={() => onPromptClick(prompt)}
            /> )}
        </div>
    )
}

export default PromptSuggestionRow 