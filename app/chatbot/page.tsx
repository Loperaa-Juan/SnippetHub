"use client";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import Image from "next/image";
import Logo from "./assets/Logo.png";
import { Message, useChat } from "ai/react";
import { Button } from "@/components/ui/button";

import "../globals.css"
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionRow from "./components/PromptSuggestionRow";

export default function ChatbotPage() {
  const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()

  const noMessages = !messages || messages.length === 0

  const handlePrompt = (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user"
    }
    append(msg)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="main">
            <Image src={Logo} width="450" alt="LogoSnippetHub"/>
            <section className={noMessages ? "" : ""}>
              {noMessages ? (
                <>
                  <p className="starter-text">
                    ¡El lugar definitivo para desarrolladores que aman escribir código limpio y reutilizable!
                    Pregúntale a Snippia por fragmentos de código sobre cualquier tema, desde trucos de frontend hasta lógica de backend,
                    y te responderá con soluciones rápidas, eficientes y prácticas.
                    ¡Esperamos que construyas algo increíble!
                  </p>
                  <br />
                  <PromptSuggestionRow onPromptClick={handlePrompt}/>
                </>
              ) : (
                <>
                  {messages.map( (message, index) => <Bubble key={`message-${index}`} message={message}/> )}
                  {isLoading && <LoadingBubble />}
                </>
              )}
            </section>
            <form onSubmit={handleSubmit} className="form">
              <input className="question-box" onChange={handleInputChange} value={input} placeholder="Preguntale algo a SnippIA..."/>
              <input type="submit"/>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
