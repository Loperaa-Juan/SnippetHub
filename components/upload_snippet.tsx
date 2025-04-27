"use client";

import { useRef, useEffect, useState } from "react";
import { UploadCloud } from "lucide-react"; // Ícono bonito de upload

type FileDropUploaderProps = {
  onDrop: (file: File) => void;
};

export function FileDropUploader({ onDrop }: FileDropUploaderProps) {
  const dropRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer?.files?.[0];
      if (file) {
        await uploadFile(file);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const div = dropRef.current;
    div?.addEventListener("drop", handleDrop);
    div?.addEventListener("dragover", handleDragOver);

    return () => {
      div?.removeEventListener("drop", handleDrop);
      div?.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
  
    const titulo = "Título de prueba";  // puedes hacerlo dinámico luego
    const contenido = "Contenido de prueba";
  
    const formData = new FormData();
    formData.append("Archivo", file); // el backend espera el archivo en el body
  
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch(`/api/publicaciones?Titulo=${encodeURIComponent(titulo)}&Contenido=${encodeURIComponent(contenido)}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error subiendo archivo:", errorText);
        alert(`Error al subir archivo: ${errorText}`);
      } else {
        alert("Archivo subido exitosamente");
      }
    } catch (err) {
      console.error("Error de red al subir archivo:", err);
      alert("Error de red al subir archivo");
    } finally {
      setUploading(false);
    }
  };
  
  

  const handleClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <div
      ref={dropRef}
      onClick={handleClick}
      className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-gray-400 rounded-lg p-6 text-center text-gray-600 cursor-pointer hover:bg-gray-50 transition"
    >
      <UploadCloud className="h-12 w-12 mb-4 text-gray-500" />
      <p className="text-sm">
        {uploading ? "Subiendo archivo..." : "Haz click o arrastra un archivo aquí para subirlo"}
      </p>

      <input
        ref={inputFileRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
