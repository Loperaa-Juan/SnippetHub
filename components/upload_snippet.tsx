"use client";

import { useRef, useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";

type FileDropUploaderProps = {
  onDrop?: (file: File) => void;
};

export function FileDropUploader({ onDrop }: FileDropUploaderProps) {
  const dropRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer?.files?.[0];
      if (file) {
        setSelectedFileName(file.name);
        onDrop?.(file);
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
  }, [onDrop]);

  const handleClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      onDrop?.(file);
    }
  };

  return (
    <div
      ref={dropRef}
      onClick={handleClick}
      className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-gray-400 rounded-lg p-6 text-center text-gray-600 cursor-pointer hover:bg-gray-50 transition"
    >
      <UploadCloud className="h-12 w-12 mb-4 text-gray-500" />

      {selectedFileName ? (
        <p className="text-sm font-medium text-gray-700">
          Archivo cargado: <span className="font-semibold">{selectedFileName}</span>
        </p>
      ) : (
        <p className="text-sm">
          Haz click o arrastra un archivo aquí para seleccionarlo
        </p>
      )}

      <input
        ref={inputFileRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
