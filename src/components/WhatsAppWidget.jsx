"use client";
import { X, ArrowUpRight } from "@phosphor-icons/react";
import { useState } from 'react';

const WHATSAPP_NUMBER = '919106291540';

const quickTopics = [
  { label: '🌐 Website Development', text: 'Hi InfronixWeb! I would like to inquire about Website Development for my business.' },
  { label: '📈 SEO Optimization', text: 'Hi InfronixWeb! I want to boost my search rankings and organic traffic with SEO.' },
  { label: '🚀 Digital Marketing & Ads', text: 'Hi InfronixWeb! I am interested in Social Media Marketing and Paid Ads (Google & Meta).' },
  { label: '🤖 AI Automation', text: 'Hi InfronixWeb! I am interested in custom AI Automation and smart business workflows.' },
  { label: '💬 Strategy Consultation', text: 'Hi InfronixWeb Team! I would like to schedule a strategy consultation for my business.' }
];

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  function getWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div className="fixed bottom-[5rem] right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none max-w-[calc(100vw-2rem)]">

      {/* Quick Chat Popup Box */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-72 sm:w-80 bg-surface-container-lowest border border-outline shadow-2xl p-4 sm:p-5 rounded-2xl animate-slide-in origin-bottom-right">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] font-bold">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm">InfronixWeb Support</h4>
                <p className="text-[11px] text-[#25D366] font-medium mt-0.5">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-light hover:text-on-surface transition-colors cursor-pointer bg-surface hover:bg-outline-variant p-1.5 rounded-full"
              aria-label="Close WhatsApp Popup"
            >
              <X className="text-lg" weight="bold" />
            </button>
          </div>

          <p className="text-xs text-main-text mb-4 leading-relaxed font-medium">
            Select a topic to start a direct chat with our team:
          </p>

          {/* Quick Action Options */}
          <div className="flex flex-col gap-2">
            {quickTopics.map((topic, idx) => (
              <a
                key={idx}
                href={getWhatsAppUrl(topic.text)}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-surface hover:bg-[#25D366] border border-outline-variant hover:border-[#25D366] text-on-surface hover:text-white text-xs font-semibold transition-all rounded-xl flex items-center justify-between group shadow-sm"
              >
                <span>{topic.label}</span>
                <ArrowUpRight className="text-text-light group-hover:text-white text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" weight="bold" />
              </a>
            ))}
          </div>

        </div>
      )}

      {/* Floating Action Button */}
      <div className="relative pointer-events-auto group">
        {/* Animated Pulse Ring */}
        <div className="absolute -inset-1 bg-[#25D366]/40 rounded-full blur-md group-hover:bg-[#25D366]/60 transition-colors animate-pulse"></div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer border-2 border-white"
          aria-label="Chat on WhatsApp"
          title="Direct WhatsApp Chat"
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </button>
      </div>

    </div>
  );
}
