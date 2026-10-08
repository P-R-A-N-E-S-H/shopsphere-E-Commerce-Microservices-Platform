'use client';

import React from 'react';
import { CATEGORIES } from '../lib/api';
import { Sparkles, Laptop, Headphones, Shirt, Home, ArrowUpDown, Filter } from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Laptop: Laptop,
  Headphones: Headphones,
  Shirt: Shirt,
  Home: Home
};

export default function CategoryFilter({
  activeCategory,
  onSelectCategory,
  sortBy,
  onSelectSort,
  selectedBrand,
  onSelectBrand,
  brands = []
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b border-slate-800/80 mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sorting and Filters */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* Brand Filter */}
        {brands.length > 0 && (
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => onSelectBrand(e.target.value)}
              aria-label="Filter by Brand"
              className="bg-slate-900 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none pr-8"
            >
              <option value="ALL">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Sort selector */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            aria-label="Sort products"
            className="bg-slate-900 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none pr-8"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
