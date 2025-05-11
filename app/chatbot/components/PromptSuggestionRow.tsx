import "../../globals.css"
import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionRow = ({onPromptClick}) => {
    
    const prompts = [
        "¿Qué es un Snippet?",
        "¿Qué es SnippetHub?",
        "¿Quienes crearon SnippetHub?",
        "¿Cómo puedo crear una publicación?"
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