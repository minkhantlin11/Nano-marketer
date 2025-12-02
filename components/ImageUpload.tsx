import React, { useRef, useState } from 'react';
import { Button } from './Button';
import { UploadedFile } from '../types';

interface ImageUploadProps {
  label: string;
  onFileSelect: (fileData: UploadedFile) => void;
  accept?: string;
  currentPreview?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, onFileSelect, accept = "image/*", currentPreview }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      onFileSelect({
        file,
        previewUrl: result,
        base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <div
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all ${
          dragActive ? "border-indigo-500 bg-slate-800/50" : "border-slate-700 bg-slate-800"
        } ${currentPreview ? 'border-solid border-indigo-500/30' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />

        {currentPreview ? (
          <div className="relative w-full h-full p-2 group">
             <img src={currentPreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <Button variant="secondary" onClick={() => inputRef.current?.click()}>Change Image</Button>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400 p-4 text-center">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="space-y-1">
              <p className="font-medium">Click to upload or drag & drop</p>
              <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
              Select File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};