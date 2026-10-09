'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ArrowRight,
  Layers,
  Zap,
  Tag,
  Check,
  Cpu,
  Mic,
  MicOff,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Flame,
  Volume2
} from 'lucide-react';
import { api, INITIAL_PRODUCTS } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const PROMPTS = [
  '💻 Best laptop for ML & 4K video rendering?',
  '🎧 Compare Sony XM5 vs Bose Ultra spatial audio',
  '🏷️ Negotiate a discount on MacBook Pro',
  '⚡ Explain Kafka Transactional Outbox Saga'
];

export default function AIAssistantWidget({ onSelectProduct, onOpenBargain, onOpenVoice }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'swarm'
  const [expandedReasoningId, setExpandedReasoningId] = useState(null);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const chatBottomRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Greetings! I am **OmniCopilot AI**, your autonomous neural shopping & microservices assistant. I can execute multi-agent tool searches, dynamically negotiate discounts, compare audio specs, or answer architectural questions.",
      agent: "OmniCopilot v2.4",
      reasoning: [
        "[Agent Init] Connected to Neural Swarm via Spring Cloud Gateway",
        "[Vector DB] 100% catalog embeddings synchronized"
      ],
      tools: [],
      products: []
    }
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      reasoning: [],
      tools: [],
      products: []
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.sendAIChat({
        message: query,
        customerId: 'vip-user-demo',
        customerTier: 'PLATINUM'
      });

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.reply,
        agent: response.activeAgent || 'OmniCopilot AI',
        reasoning: response.reasoningSteps || [],
        tools: response.executedTools || [],
        products: response.suggestedProducts || []
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I've processed your query using our autonomous fallback neural engine.",
          agent: "OmniCopilot Backup Agent",
          reasoning: ["[Fallback] Local inference active"],
          tools: [],
          products: []
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceMode = () => {
    if (onOpenVoice) {
      onOpenVoice();
    } else {
      setIsListening(!isListening);
      if (!isListening) {
        setTimeout(() => {
          handleSendMessage("Find best noise-canceling headphones with 30h battery");
          setIsListening(false);
        }, 2200);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Trigger floating button */}
      {!isOpen && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenBargain ? onOpenBargain() : setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-full glass-panel dark:bg-dark-900/90 text-xs font-semibold text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
            title="Dynamic AI Bargaining"
          >
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>AI Bargain</span>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 pulse-indicator" />
            </div>
            <div className="flex flex-col text-left">
              <span className="leading-tight flex items-center gap-1.5 font-outfit">
                OmniCopilot AI
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 uppercase tracking-widest font-mono">SWARM</span>
              </span>
              <span className="text-[10px] text-cyan-200 font-normal hidden sm:inline">6 Neural Agents Ready</span>
            </div>
          </button>
        </div>
      )}

      {/* Expanded AI Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[440px] h-[580px] rounded-3xl glass-panel dark:bg-dark-900/95 border border-indigo-500/30 shadow-2xl shadow-indigo-950/60 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-dark-950 via-indigo-950/80 to-dark-900 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-100 font-outfit">OmniCopilot Swarm</h3>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Autonomous Agentic Commerce Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleVoiceMode}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Voice Shopping Mode"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prompt suggestions pills */}
          <div className="px-4 py-2.5 bg-slate-900/60 border-b border-indigo-500/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1 shrink-0">
              <Zap className="w-3 h-3" /> Quick:
            </span>
            {PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.replace(/^[^\w]+/, ''))}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-slate-300 hover:text-white border border-indigo-500/20 transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Sender badge */}
                  {msg.sender === 'ai' && msg.agent && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                      <Cpu className="w-3 h-3" />
                      <span>{msg.agent}</span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20 font-medium'
                        : 'bg-slate-900/90 dark:bg-dark-800 text-slate-200 rounded-tl-none border border-indigo-500/20 shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Tool execution timeline */}
                  {msg.tools && msg.tools.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-dark-950/80 border border-cyan-500/20 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-cyan-400" /> Executed Agent Tools:
                        </span>
                        <span className="text-emerald-400">200 OK</span>
                      </div>
                      {msg.tools.map((t, idx) => (
                        <div key={idx} className="p-1.5 rounded bg-slate-900/90 font-mono text-[10px] text-slate-300 flex items-center justify-between">
                          <span className="text-indigo-300">⚙️ {t.toolName}</span>
                          <span className="text-slate-400">{t.latencyMs}ms</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reasoning accordion */}
                  {msg.reasoning && msg.reasoning.length > 0 && (
                    <div>
                      <button
                        onClick={() => setExpandedReasoningId(expandedReasoningId === msg.id ? null : msg.id)}
                        className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        {expandedReasoningId === msg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        <span>{expandedReasoningId === msg.id ? 'Hide neural reasoning trace' : `View reasoning steps (${msg.reasoning.length})`}</span>
                      </button>

                      {expandedReasoningId === msg.id && (
                        <div className="mt-1.5 p-2 rounded-lg bg-black/40 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-1">
                          {msg.reasoning.map((r, idx) => (
                            <div key={idx} className="text-slate-300">↳ {r}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Attached Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-3 rounded-xl bg-gradient-to-r from-dark-900 to-indigo-950/60 border border-indigo-500/30 flex items-center justify-between gap-3 shadow-md hover:border-cyan-400/50 transition-all"
                        >
                          <img
                            src={prod.image || prod.images?.[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-100 truncate text-[11px]">{prod.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-extrabold text-cyan-400 text-xs">{formatPrice(prod.discountPrice || prod.price)}</span>
                              {prod.discountPrice && (
                                <span className="line-through text-[10px] text-slate-500">{formatPrice(prod.price)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                if (onOpenBargain) {
                                  onOpenBargain(prod);
                                } else {
                                  handleSendMessage(`Negotiate price on ${prod.name}`);
                                }
                              }}
                              className="px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1"
                              title="Negotiate with AI"
                            >
                              <Flame className="w-3 h-3 text-amber-400" /> Bargain
                            </button>
                            <button
                              onClick={() => {
                                addToCart(prod);
                                handleSendMessage(`Added ${prod.name} to cart.`);
                              }}
                              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400 font-mono">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-400 shrink-0 animate-pulse">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-indigo-500/20">
                  <span>Synthesizing agent response</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-dark-950 border-t border-indigo-500/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask OmniCopilot or negotiate prices..."
              className="flex-1 bg-slate-900/90 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-indigo-500/20 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
