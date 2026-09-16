"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, X, CaretRight, Briefcase, Users, Folder, BookOpen, ShieldCheck, CheckSquare, CurrencyInr } from '@phosphor-icons/react';

const CATEGORY_ICONS = {
  Leads: Briefcase,
  Projects: Folder,
  Tasks: CheckSquare,
  SOPs: BookOpen,
  People: Users,
  Security: ShieldCheck,
  Finance: CurrencyInr
};

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/founder-os/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item) => {
    onClose();
    if (onNavigate && item.url) {
      onNavigate(item.url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <MagnifyingGlass size={20} className="text-violet-600 shrink-0" weight="bold" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search leads, projects, tasks, SOPs, finance, team..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
          />
          {loading && <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim().length >= 2 && results.length === 0 && !loading && (
            <div className="py-12 text-center text-xs sm:text-sm text-slate-500">
              No matching records found for "{query}".
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="py-8 px-4 text-center">
              <span className="text-xs text-slate-400 block mb-3 font-bold uppercase tracking-wider">QUICK NAVIGATION SHORTCUTS</span>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => { onClose(); onNavigate('/admin?tab=sales'); }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                >
                  💼 Sales CRM
                </button>
                <button
                  type="button"
                  onClick={() => { onClose(); onNavigate('/admin?tab=delivery'); }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                >
                  🚀 Projects
                </button>
                <button
                  type="button"
                  onClick={() => { onClose(); onNavigate('/admin?tab=finance'); }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                >
                  💰 Finance
                </button>
                <button
                  type="button"
                  onClick={() => { onClose(); onNavigate('/admin?tab=security'); }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                >
                  🛡️ Security
                </button>
                <button
                  type="button"
                  onClick={() => { onClose(); onNavigate('/admin?tab=sops'); }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                >
                  📚 SOP Library
                </button>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const IconComponent = CATEGORY_ICONS[item.category] || Folder;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected ? 'bg-violet-50 text-violet-900 border border-violet-200 shadow-xs' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <IconComponent size={16} weight="bold" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-2">
                          <span>{item.title}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            {item.category}
                          </span>
                        </div>
                        {item.subtitle && (
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <CaretRight size={14} className={`shrink-0 ${isSelected ? 'text-violet-600' : 'text-slate-400'}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">InfronixWeb Command Center</span>
        </div>
      </div>
    </div>
  );
}
