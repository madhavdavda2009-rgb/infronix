"use client";
import { X, ArrowUpRight } from "@phosphor-icons/react";
import { useState } from 'react';

const WHATSAPP_NUMBER = '916355792936';

const quickTopics = [
  { label: '🌐 Website Development', text: 'Hi Infronix! I would like to inquire about Website Development for my business.' },
  { label: '📈 SEO Optimization', text: 'Hi Infronix! I want to boost my search rankings and organic traffic with SEO.' },
  { label: '🤖 AI Automation', text: 'Hi Infronix! I am interested in custom AI Automation and LLM workflows.' },
  { label: '💬 General Inquiry', text: 'Hi Infronix Team! I would like to schedule a strategy consultation.' }
];

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  function getWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none max-w-[calc(100vw-2rem)]">

      {/* Quick Chat Popup Box */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-72 sm:w-80 bg-navy-dark border border-champagne-light/40 shadow-2xl p-4 sm:p-5 rounded-none animate-slide-in backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-champagne-light/20 border border-champagne-light/50 flex items-center justify-center text-champagne-light font-bold">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Infronix WhatsApp Support</h4>
                <p className="text-[11px] text-champagne-light font-mono font-semibold">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close WhatsApp Popup"
            >
              <X className="text-lg" weight="bold" />
            </button>
          </div>

          <p className="text-xs text-slate-200 mb-4 leading-relaxed font-medium">
            Select a topic to start a direct WhatsApp chat with our technical directors:
          </p>

          {/* Quick Action Options */}
          <div className="flex flex-col gap-2">
            {quickTopics.map((topic, idx) => (
              <a
                key={idx}
                href={getWhatsAppUrl(topic.text)}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 bg-slate-900 hover:bg-navy-muted/80 border border-slate-800 hover:border-champagne-light/60 text-slate-200 hover:text-champagne-light text-xs font-semibold transition-all rounded-none flex items-center justify-between group"
              >
                <span>{topic.label}</span>
                <ArrowUpRight className="text-champagne-light text-sm group-hover:translate-x-1 transition-transform" weight="bold" />
              </a>
            ))}
          </div>

        </div>
      )}

      {/* Floating Action Button */}
      <div className="relative pointer-events-auto group">
        {/* Animated Pulse Ring */}
        <div className="absolute -inset-1 bg-champagne-light/30 rounded-full blur-md group-hover:bg-champagne-light/50 transition-colors animate-pulse"></div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-champagne-light hover:bg-white text-navy-muted rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer border-2 border-champagne-light/50"
          aria-label="Chat on WhatsApp"
          title="Direct WhatsApp Chat (6355792936)"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </button>
      </div>

    </div>
  );
}
