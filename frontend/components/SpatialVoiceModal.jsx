'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ArrowRight,
  Radio,
  CheckCircle2,
  Flame,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { INITIAL_PRODUCTS } from '../lib/api';

const VOICE_PRESETS = [
  '🎧 "Find Sony noise-canceling headphones under $350"',
  '💻 "Negotiate a discount on the MacBook Pro 16"',
  '⚡ "Show me top-rated titanium gadgets"',
  '📦 "Track my FedEx delivery dispatch"'
];

export default function SpatialVoiceModal({ isOpen, onClose, onSelectProduct, onOpenBargain, onSearchKeyword }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Tap microphone or pick a spoken phrase below');
  const [recognizedAction, setRecognizedAction] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setStatusMessage('Listening to voice stream...');
      const timer = setTimeout(() => {
        handleTriggerCommand('🎧 Find Sony noise-canceling headphones under $350');
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      setIsListening(false);
      setTranscript('');
      setRecognizedAction(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerCommand = (cmdText) => {
    setIsListening(true);
    setTranscript(cmdText);
    setStatusMessage('Transcribing & parsing speech intent...');

    setTimeout(() => {
      setIsListening(false);
      const lower = cmdText.toLowerCase();

      if (lower.includes('macbook') || lower.includes('bargain') || lower.includes('discount')) {
        setRecognizedAction({
          type: 'BARGAIN',
          title: 'Dynamic AI Bargaining Triggered',
          message: 'Opening Bargaining Arena for MacBook Pro 16" M3 Max with authorized VIP margin allowance.',
          product: INITIAL_PRODUCTS[0]
        });
        setStatusMessage('Action synthesized successfully');
      } else {
        setRecognizedAction({
          type: 'SEARCH',
          title: 'Catalog Query & Filter Applied',
          message: 'Found Sony WH-1000XM5 Wireless Headphones (30h Battery, Dual ANC Processors).',
          product: INITIAL_PRODUCTS[1]
        });
        setStatusMessage('Action synthesized successfully');
      }
    }, 1200);
  };

  const handleExecuteAction = () => {
    if (recognizedAction) {
      if (recognizedAction.type === 'BARGAIN' && onOpenBargain) {
        onClose();
        onOpenBargain(recognizedAction.product);
      } else if (recognizedAction.type === 'SEARCH') {
        if (onSearchKeyword) {
          onSearchKeyword('Sony');
        }
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl glass-panel dark:bg-dark-900/95 border border-pink-500/30 shadow-2xl shadow-pink-950/50 overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-dark-950 via-pink-950/40 to-dark-900 border-b border-pink-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white font-outfit flex items-center gap-2">
                Spatial Voice Commerce
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 font-mono">
                  ACOUSTIC AI
                </span>
              </h2>
              <p className="text-xs text-pink-200/70">Natural Speech-to-Intent Command Execution</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6 flex flex-col items-center text-center">
          {/* Pulsing Animated Mic Ring */}
          <div className="relative my-4 flex items-center justify-center">
            {isListening && (
              <>
                <div className="absolute w-36 h-36 rounded-full bg-pink-500/20 animate-ping" />
                <div className="absolute w-28 h-28 rounded-full bg-rose-500/30 animate-pulse" />
              </>
            )}
            <button
              onClick={() => setIsListening(!isListening)}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
                isListening
                  ? 'bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/50 scale-105'
                  : 'bg-slate-800 border-2 border-slate-700 hover:border-pink-400 text-slate-300'
              }`}
            >
              {isListening ? <Mic className="w-9 h-9 animate-bounce" /> : <MicOff className="w-8 h-8" />}
            </button>
          </div>

          {/* Status and Transcript display */}
          <div className="space-y-1.5 w-full max-w-md">
            <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400 font-bold">
              {statusMessage}
            </span>
            <div className="p-3.5 rounded-2xl bg-black/50 border border-pink-500/20 min-h-[48px] flex items-center justify-center">
              <p className="text-xs sm:text-sm font-semibold text-slate-200 italic">
                {transcript ? `"${transcript}"` : 'Listening for audio waveform...'}
              </p>
            </div>
          </div>

          {/* Quick preset phrases */}
          <div className="w-full space-y-2 text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Or tap a sample voice command:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VOICE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTriggerCommand(p)}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-pink-950/40 border border-slate-800 hover:border-pink-500/30 text-slate-300 hover:text-pink-200 text-xs font-medium text-left transition-all truncate"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Action result banner */}
          {recognizedAction && (
            <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-dark-950 to-pink-950/40 border border-pink-500/40 text-left space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-pink-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {recognizedAction.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold">
                  AUTONOMOUS INTENT
                </span>
              </div>
              <p className="text-xs text-slate-300">{recognizedAction.message}</p>

              <button
                onClick={handleExecuteAction}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Execute Storefront Action</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
