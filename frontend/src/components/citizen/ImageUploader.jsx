import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, X, Sparkles, AlertTriangle } from 'lucide-react';
import { sampleHazards } from '../../services/sampleHazards';

export const ImageUploader = ({ imageUrl, onImageChange, onSelectPreset }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      onImageChange(uploadEvent.target.result);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onImageChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* 1-Click Quick Demo Presets */}
      <div className="charcoal-glass p-3.5 rounded-2xl border border-white/15">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_#ffffff]" />
            Quick Demo Presets (1-Click Auto-Fill)
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">Test AI Vision instantly</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {sampleHazards.map((hazard) => (
            <button
              key={hazard.id}
              type="button"
              onClick={() => onSelectPreset(hazard)}
              className="flex items-center gap-2 p-2 rounded-xl charcoal-pill hover:border-white/50 text-left transition-all group cursor-pointer"
            >
              <img
                src={hazard.imageUrl}
                alt={hazard.title}
                className="w-9 h-9 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform border border-white/20"
              />
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-zinc-200 truncate group-hover:text-white">
                  {hazard.badge}
                </p>
                <p className="text-[10px] text-zinc-400 truncate font-mono">{hazard.category.split('&')[0]}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload Box */}
      {imageUrl ? (
        <div className="relative rounded-2xl border border-white/25 overflow-hidden bg-black group shadow-xl">
          <img
            src={imageUrl}
            alt="Hazard Evidence"
            className="w-full h-56 sm:h-64 object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity"
          />

          {/* Overlay Tag with White Specular Rim */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Image Attached for AI Defect Extraction</span>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/80 hover:bg-red-600 text-white transition-colors border border-white/20"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-white bg-white/10 scale-[0.99] shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              : 'border-white/20 hover:border-white/50 bg-black/40 hover:bg-black/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="mx-auto w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mb-3 shadow-inner">
            <UploadCloud className="w-6 h-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
          </div>

          <h5 className="text-xs font-bold text-white">
            {isProcessing ? 'Processing Image...' : 'Click to Upload Hazard Photo or Drag & Drop'}
          </h5>
          <p className="text-[11px] text-zinc-400 mt-1">
            Supports JPG, PNG, WEBP up to 10MB. AI Vision extracts defect depth & coordinates automatically.
          </p>
        </div>
      )}
    </div>
  );
};
