import "../../globals.css"

const PromptSuggestionButton = ({text, onClick}) => {
    return(
        <button 
        className="propmt-suggestion-button"
        onClick={onClick}
        >
            { text }
        </button>
    )
}

export default PromptSuggestionButton