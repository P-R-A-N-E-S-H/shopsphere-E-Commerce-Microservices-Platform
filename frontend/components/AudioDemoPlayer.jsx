'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Headphones, Radio, Sparkles, Sliders } from 'lucide-react';

export default function AudioDemoPlayer({ productName }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundMode, setSoundMode] = useState('ANC'); // 'ANC' | 'TRANSPARENCY' | 'SPATIAL' | 'BASS'
  const [volume, setVolume] = useState(80);

  const barHeights = [45, 80, 60, 95, 30, 75, 90, 50, 65, 85, 40, 70];

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 shadow-lg">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-100">Live Spatial Audio & ANC Test Demo</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
          Hi-Res 24-bit / 96kHz
        </span>
      </div>

      {/* Sound Equalizer Visualizer */}
      <div className="h-12 bg-slate-900/90 rounded-xl px-4 flex items-center justify-between gap-1.5 border border-slate-800">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-400 animate-pulse'
                : 'bg-slate-700 h-2'
            }`}
            style={{
              height: isPlaying ? `${Math.max(15, (h * volume) / 100)}%` : '6px',
              animationDelay: `${i * 0.08}s`
            }}
          />
        ))}
      </div>

      {/* Sound Mode Switcher */}
      <div className="grid grid-cols-4 gap-1.5 text-[10px] font-semibold">
        {[
          { id: 'ANC', label: 'Noise Cancel' },
          { id: 'TRANSPARENCY', label: 'Ambient Aware' },
          { id: 'SPATIAL', label: 'Spatial 360°' },
          { id: 'BASS', label: 'Bass Boost' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setSoundMode(m.id)}
            className={`py-1.5 rounded-lg border text-center transition ${
              soundMode === m.id
                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Play Controls & Volume */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Demo</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Play Acoustic Demo</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="range"
            min="10"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 accent-indigo-500 h-1 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
