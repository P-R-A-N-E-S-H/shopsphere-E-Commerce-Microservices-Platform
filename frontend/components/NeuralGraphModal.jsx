'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Network,
  Cpu,
  Activity,
  Zap,
  Server,
  Shield,
  Layers,
  Sparkles,
  Bot,
  RefreshCw
} from 'lucide-react';
import { api } from '../lib/api';

export default function NeuralGraphModal({ isOpen, onClose }) {
  const [telemetry, setTelemetry] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState('mesh'); // 'mesh' | 'agents'

  useEffect(() => {
    if (isOpen) {
      loadTelemetry();
    }
  }, [isOpen]);

  const loadTelemetry = async () => {
    try {
      const data = await api.getSwarmTelemetry();
      setTelemetry(data);
      if (data.agents && data.agents.length > 0) {
        setSelectedNode(data.agents[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl rounded-3xl glass-panel dark:bg-dark-900/95 border border-purple-500/30 shadow-2xl shadow-purple-950/50 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-dark-950 via-purple-950/40 to-dark-900 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white font-outfit">
                  Neural Commerce Mesh &amp; Agent Swarm
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-purple-200/70">Real-Time Microservices Topology &amp; Multi-Agent Swarm Orchestration</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadTelemetry}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top KPIs Banner */}
        {telemetry && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-950/80 border-b border-purple-500/10 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Swarm Workers</span>
              <span className="text-lg font-extrabold text-white font-outfit">{telemetry.activeAgentsCount} Autonomous Agents</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Inference Latency</span>
              <span className="text-lg font-extrabold text-cyan-400 font-mono">{telemetry.averageAgentLatencyMs}ms</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fraud Shield Accuracy</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{telemetry.fraudPreventionAccuracy}%</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bargaining Savings</span>
              <span className="text-lg font-extrabold text-amber-400 font-mono">${telemetry.totalBargainSavingsGenerated.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Animated SVG Visualizer Mesh */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-dark-950 via-slate-950 to-dark-900 border border-purple-500/20 p-4 shadow-inner">
            <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px]">
              {/* Central Core Agent Node */}
              <div className="relative flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center text-white shadow-2xl shadow-purple-500/40 border-2 border-purple-300 animate-pulse-subtle cursor-pointer">
                  <Bot className="w-8 h-8" />
                  <span className="text-[9px] font-black font-mono tracking-widest mt-1">ORCHESTRATOR</span>
                </div>
                <span className="text-[11px] font-bold text-white mt-2 font-outfit">AI Orchestrator (Port 8095)</span>
              </div>

              {/* Orbiting Satellite Agent Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-6">
                {telemetry?.agents?.map((ag) => (
                  <button
                    key={ag.agentId}
                    onClick={() => setSelectedNode(ag)}
                    className={`p-3.5 rounded-2xl border transition-all text-left group ${
                      selectedNode?.agentId === ag.agentId
                        ? 'bg-purple-950/60 border-purple-400 shadow-lg shadow-purple-500/20'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{ag.agentId}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <h4 className="font-extrabold text-xs text-white mt-1 group-hover:text-purple-300 transition-colors">
                      {ag.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{ag.role}</p>

                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Core Load:</span>
                      <span className="font-mono font-bold text-purple-300">{ag.loadPercent}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Node Inspector Card */}
          {selectedNode && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-extrabold text-white">{selectedNode.name}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                  {selectedNode.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-xs font-mono space-y-1.5">
                <div className="text-slate-400"><span className="text-slate-500">Role:</span> {selectedNode.role}</div>
                <div className="text-cyan-300"><span className="text-slate-500">Latest Event Action:</span> {selectedNode.lastAction}</div>
                <div className="text-emerald-400"><span className="text-slate-500">Telemetry Channel:</span> Kafka Topic [ai-insights-events]</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
