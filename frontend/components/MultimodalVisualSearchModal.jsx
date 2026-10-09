'use client';

import React, { useState } from 'react';
import {
  X,
  Camera,
  Scan,
  Sparkles,
  Eye,
  Palette,
  ShoppingBag,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Layers,
  Zap
} from 'lucide-react';
import { api, INITIAL_PRODUCTS } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const PRESET_SAMPLES = [
  {
    id: 'sample-1',
    title: 'Matte Audiophile Headphones',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    category: 'Audio'
  },
  {
    id: 'sample-2',
    title: 'Heritage Streetwear Sneakers',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    category: 'Fashion'
  },
  {
    id: 'sample-3',
    title: 'Space Black Creator Laptop',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    category: 'Laptops'
  },
  {
    id: 'sample-4',
    title: 'Titanium Flagship Phone',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
    category: 'Phones'
  }
];

export default function MultimodalVisualSearchModal({ isOpen, onClose, onSelectProduct }) {
  const [selectedImage, setSelectedImage] = useState(PRESET_SAMPLES[0].imageUrl);
  const [customUrl, setCustomUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  const handleRunScan = async (imageUrlToScan) => {
    const url = imageUrlToScan || selectedImage;
    setIsScanning(true);
    setScanResult(null);

    try {
      const response = await api.searchMultimodalVision({ imageUrl: url });
      setScanResult(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl rounded-3xl glass-panel dark:bg-dark-900/95 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-dark-950 via-cyan-950/40 to-dark-900 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white font-outfit flex items-center gap-2">
                Multimodal AI Visual Search
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  DEEP VISION
                </span>
              </h2>
              <p className="text-xs text-cyan-200/70">Silhouette Recognition, Color Spectrum Extraction & Style Alignment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Sample Selectors */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" /> Choose Image Sample or Paste URL:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedImage(sample.imageUrl);
                    handleRunScan(sample.imageUrl);
                  }}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all text-left p-1.5 ${
                    selectedImage === sample.imageUrl
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/30 bg-cyan-950/40'
                      : 'border-slate-800 hover:border-slate-600 bg-slate-900/60'
                  }`}
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    className="w-full h-24 object-cover rounded-xl group-hover:scale-105 transition-transform"
                  />
                  <div className="p-1.5">
                    <span className="text-[10px] text-cyan-400 font-bold block">{sample.category}</span>
                    <p className="text-[11px] font-bold text-slate-200 truncate">{sample.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Inspection & Scanning Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Image with HUD scanner */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-black/60 shadow-xl group">
              <img
                src={selectedImage}
                alt="Target Vision"
                className="w-full h-64 object-cover"
              />

              {/* Scanning HUD Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-cyan-950/50 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mb-3" />
                  <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider">EXTRACTING EMBEDDING TENSORS...</span>
                  <span className="text-[10px] text-slate-300 mt-1">Cosine vector similarity in progress</span>
                </div>
              )}

              {/* HUD Bounding Box Overlay if completed */}
              {!isScanning && scanResult && (
                <div className="absolute inset-4 border-2 border-dashed border-cyan-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <span className="bg-cyan-500 text-slate-950 font-mono text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                      {scanResult.aestheticStyle}
                    </span>
                    <span className="bg-emerald-500 text-slate-950 font-mono text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                      99.2% CONFIDENCE
                    </span>
                  </div>
                  <div className="bg-black/70 backdrop-blur-sm p-1.5 rounded text-[10px] font-mono text-cyan-300">
                    Target Vector: [1536-dim normalized]
                  </div>
                </div>
              )}
            </div>

            {/* Right: AI Vision Insights */}
            <div className="space-y-4">
              <button
                onClick={() => handleRunScan(selectedImage)}
                disabled={isScanning}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Scan className="w-4 h-4" /> Run Deep Multimodal Analysis
              </button>

              {scanResult && (
                <div className="space-y-4 animate-fade-in">
                  {/* Extracted Colors */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-cyan-400" /> Extracted Color Spectrum:
                    </span>
                    <div className="flex items-center gap-2">
                      {scanResult.extractedColors?.map((hex, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-slate-800">
                          <div className="w-5 h-5 rounded-md shadow-sm border border-white/20" style={{ backgroundColor: hex }} />
                          <span className="font-mono text-[10px] text-slate-300 font-bold">{hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detected Features */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" /> Detected Structural Elements:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.detectedObjects?.map((obj, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold">
                          ✓ {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Matched Catalog Products */}
          {scanResult && scanResult.matchingProducts && (
            <div className="space-y-3 pt-2 border-t border-slate-800 animate-fade-in">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Vector Similarity Catalog Matches:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scanResult.matchingProducts.map((match) => (
                  <div
                    key={match.productId}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-dark-950 to-cyan-950/30 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-md hover:border-cyan-400 transition-all"
                  >
                    <img
                      src={match.imageUrl}
                      alt={match.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                          {Math.round(match.similarityScore * 100)}% Match
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs text-white truncate mt-0.5">{match.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">Matched: {match.matchedFeature}</p>
                      <span className="font-black text-xs text-cyan-400 block mt-1">{formatPrice(match.price)}</span>
                    </div>
                    <div className="shrink-0 flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          const prod = INITIAL_PRODUCTS.find((p) => p.id === match.productId) || {
                            id: match.productId,
                            name: match.name,
                            price: match.price,
                            images: [match.imageUrl]
                          };
                          addToCart(prod);
                        }}
                        className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 transition-all"
                        title="Add Matched Item to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
