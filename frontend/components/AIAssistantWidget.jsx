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
  Check
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const PROMPTS = [
  '💻 Best laptop for engineering & ML?',
  '🎧 Noise-cancelling headphones under $350?',
  '🪑 Best ergonomic chair for remote work?',
  '🏷️ Give me active discount coupons'
];

export default function AIAssistantWidget({ onSelectProduct }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const chatBottomRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm **ShopSphere AI Advisor**, your intelligent e-commerce and microservices assistant. How can I assist you with product recommendations, technical specifications, or active deals today?",
      product: null
    }
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query, product: null };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let matchedProduct = null;
      const lower = query.toLowerCase();

      if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('engineering') || lower.includes('apple')) {
        matchedProduct = INITIAL_PRODUCTS.find((p) => p.slug.includes('macbook'));
        replyText = `For demanding workloads, software engineering, and AI tasks, I highly recommend the **${matchedProduct.name}**. It features unified high-bandwidth memory, all-day battery life, and space black aluminum thermal architecture.`;
      } else if (lower.includes('headphone') || lower.includes('audio') || lower.includes('sound') || lower.includes('sony')) {
        matchedProduct = INITIAL_PRODUCTS.find((p) => p.slug.includes('sony'));
        replyText = `The **${matchedProduct.name}** is our top-rated audio choice. It delivers industry-leading dual-processor ANC and 30-hour playback. Use code **SAVE20** for an additional 20% off!`;
      } else if (lower.includes('chair') || lower.includes('desk') || lower.includes('ergo') || lower.includes('home')) {
        matchedProduct = INITIAL_PRODUCTS.find((p) => p.slug.includes('chair'));
        replyText = `The **${matchedProduct.name}** offers dynamic lumbar reinforcement and 4D armrests designed for 10+ hour ergonomic seating.`;
      } else if (lower.includes('coupon') || lower.includes('discount') || lower.includes('promo') || lower.includes('code') || lower.includes('deal')) {
        replyText = `Here are our verified promo codes available right now:\n\n• **SAVE20** — 20% off any order\n• **WELCOME10** — 10% first order discount\n• **FLAT50** — $50 off flat discount on orders over $250`;
      } else if (lower.includes('saga') || lower.includes('kafka') || lower.includes('architecture') || lower.includes('microservice')) {
        replyText = `ShopSphere orchestrates checkouts across 14 microservices using **Apache Kafka Sagas with the Transactional Outbox Pattern**. Database state changes and Kafka events commit atomically, guaranteeing zero lost transactions and automated compensatory rollbacks.`;
      } else {
        matchedProduct = INITIAL_PRODUCTS[Math.floor(Math.random() * INITIAL_PRODUCTS.length)];
        replyText = `Based on current popularity, you might love the **${matchedProduct.name}** with a rating of ${matchedProduct.rating}★!`;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: replyText, product: matchedProduct }
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Trigger floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <span className="hidden sm:inline">AI Shopping Copilot</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[540px] bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-100 text-sm">ShopSphere Copilot</h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">AI</span>
                </div>
                <p className="text-[11px] text-slate-400">Powered by Neural Product Recommendation</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex gap-2 scrollbar-none">
            {PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition border border-slate-750 shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-2`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>

                  {/* Product Recommendation Card embedded in message */}
                  {m.product && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between gap-3 shadow-lg">
                      <img
                        src={m.product.images[0]}
                        alt={m.product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">{m.product.name}</p>
                        <p className="text-[11px] font-bold text-emerald-400">
                          {formatPrice(m.product.discountPrice || m.product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(m.product, 1)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow shrink-0"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-300">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950/80 border-t border-slate-800 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask for advice, specs, or discount codes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
