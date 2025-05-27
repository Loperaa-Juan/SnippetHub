"use client";
import { Navbar } from "@/components/navbar";
import fs from "node:fs";
import { Sidebar } from "@/components/sidebar";
import Image from "next/image";
import Logo from "./assets/Logo.png";
import { Message, useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import {Mic} from "lucide-react"

import "../globals.css"
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionRow from "./components/PromptSuggestionRow";
import { useState } from "react";
import "dotenv/config"
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export default function ChatbotPage() {
  const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorderRef, setMediaRecorderRef] = useState(null);

  const noMessages = !messages || messages.length === 0

  const handlePrompt = (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user"
    }
    append(msg)
  }

  const Transcribir = async (audioBlob) => {
    const file = new File([audioBlob], "audio.wav", { type: "audio/wav" });
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1"
    });
    return transcription.text;
  };

  const handleRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 44100,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true
      }
    });

    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const prompt = await Transcribir(audioBlob);
      handlePrompt(prompt);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setMediaRecorderRef(mediaRecorder);
  };

  const stopRecording = () => {
    if (mediaRecorderRef && isRecording) {
      mediaRecorderRef.stop();
      mediaRecorderRef.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

    

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
              <Button
               variant="ghost"
               onClick={isRecording ? stopRecording : handleRecord}
               className="w-fit border-0 rounded-xl text-white bg-purple-950 cursor-pointer transition-all duration-300 ease-in-out px-6 py-4 hover:bg-purple-700 hover:scale-105"
              >
                <Mic/>
              </Button>
              <input type="submit"/>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
