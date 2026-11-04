"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, PaperPlaneRight, Microphone, SpeakerHigh, SpeakerSlash, ArrowUpRight,
} from '@phosphor-icons/react';
import { useIntro } from '@/context/IntroContext';
import {
  BOT_NAME, LEAD_STEPS, NUDGES, getReply, getPageContext, buildGreeting, isCancel, buildLeadSummary,
} from '@/lib/chatbot-knowledge';

const HIDDEN_PREFIXES = ['/admin', '/founder-os', '/client'];
const MEMORY_KEY = 'niya-memory';
const SESSION_AUTO = 'niya-auto-opened';
const SESSION_NUDGES = 'niya-nudges';
const SESSION_EXIT = 'niya-exit-shown';
const AUTO_OPEN_DELAY = 2500;
const IDLE_MS = 60000;
const FORM_IDLE_MS = 45000;
const MAX_NUDGES_PER_SESSION = 3;
// Topics that say nothing about what the visitor wants, so they are not remembered as interests.
const NOT_INTERESTS = new Set(['greeting', 'thanks', 'bye', 'bot', 'menu', 'greeting-open', 'lead-summary', 'stuck', 'real-person', 'eli5']);

// Make prices, symbols and line breaks sound natural when read aloud.
function toSpeech(text) {
  return String(text)
    .replace(/₹\s?([\d,]+)/g, '$1 rupees')
    .replace(/–/g, ' to ')
    .replace(/\+25%/g, 'plus 25 percent')
    .replace(/[•]/g, '')
    .replace(/\n/g, '. ');
}

function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'en-IN' && /female|heera|neerja|google/i.test(v.name)) ||
    voices.find((v) => v.lang === 'en-IN') ||
    voices.find((v) => v.lang?.startsWith('en') && /female|zira|samantha|google/i.test(v.name)) ||
    voices.find((v) => v.lang?.startsWith('en')) ||
    null
  );
}

// ── This browser's memory of the visitor (never sent anywhere) ──
function readMemory() {
  try { return JSON.parse(localStorage.getItem(MEMORY_KEY)) || {}; } catch { return {}; }
}
function writeMemory(update) {
  try {
    const next = { ...readMemory(), ...update };
    localStorage.setItem(MEMORY_KEY, JSON.stringify(next));
    return next;
  } catch { return update; }
}
function sessionGet(key) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function sessionSet(key, value) {
  try { sessionStorage.setItem(key, value); } catch { /* private mode */ }
}

function NiyaAvatar({ size = 'w-8 h-8' }) {
  return (
    <span className={`${size} shrink-0 rounded-full overflow-hidden bg-soft-violet border border-primary/15 shadow-sm`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/niya-avatar-96.webp" alt="" width={96} height={96} className="w-full h-full object-cover" loading="lazy" />
    </span>
  );
}

export default function ChatbotWidget() {
  const pathname = usePathname() || '/';
  const { introPhase, isIntroActive } = useIntro();
  const introDone = !isIntroActive || introPhase === 'completed';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [teaser, setTeaser] = useState(null);
  const [voiceOn, setVoiceOn] = useState(true);
  const [canSpeak, setCanSpeak] = useState(false);
  const [canListen, setCanListen] = useState(false);
  const [listening, setListening] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const leadRef = useRef(null);
  const learnedRef = useRef(null);
  const pendingLearnRef = useRef(null);
  const greetedPathRef = useRef(null);
  const nudgedPathsRef = useRef(new Set());
  const openRef = useRef(open);
  const voiceOnRef = useRef(voiceOn);
  openRef.current = open;
  voiceOnRef.current = voiceOn;

  const hidden = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));

  // ── Setup: browser features, visit count, learned phrases ──
  useEffect(() => {
    setCanSpeak('speechSynthesis' in window);
    setCanListen(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    window.speechSynthesis?.getVoices();

    const memory = readMemory();
    const now = Date.now();
    if (!memory.lastVisit || now - memory.lastVisit > 30 * 60 * 1000) {
      writeMemory({ visits: (memory.visits || 0) + 1, lastVisit: now });
    } else {
      writeMemory({ lastVisit: now });
    }

    fetch('/api/public/niya')
      .then((r) => r.json())
      .then((d) => { learnedRef.current = Array.isArray(d?.learned) ? d.learned : null; })
      .catch(() => {});
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setTeaser(null);
      inputRef.current?.focus({ preventScroll: true });
    } else {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort?.();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Greet for the current page; when the visitor moves to another page, add that page's greeting.
  const greetForPage = useCallback(() => {
    if (greetedPathRef.current === pathname) return;
    const first = greetedPathRef.current === null;
    greetedPathRef.current = pathname;
    if (first) {
      setMessages([{ from: 'bot', ...buildGreeting(pathname, readMemory()) }]);
      return;
    }
    const ctx = getPageContext(pathname);
    if (ctx) setMessages((m) => [...m, { from: 'bot', id: 'page', text: ctx.greet, chips: ctx.chips }]);
  }, [pathname]);

  useEffect(() => { if (open) greetForPage(); }, [open, greetForPage]);

  const openChat = useCallback(() => {
    greetForPage();
    setOpen(true);
  }, [greetForPage]);

  // ── Pop up on every page, after the intro animation ──
  // First page of the visit: the full chat on desktop (a bubble on phones, where a panel would
  // cover the page). Every later page: a bubble with that page's own message.
  useEffect(() => {
    setTeaser(null); // a bubble from the previous page no longer applies
    if (hidden || !introDone) return;
    const timer = setTimeout(() => {
      if (openRef.current) return; // already chatting: the page greeting is added inside the chat
      const firstOfVisit = !sessionGet(SESSION_AUTO);
      sessionSet(SESSION_AUTO, '1');
      const greeting = buildGreeting(pathname, readMemory());
      if (firstOfVisit && window.matchMedia('(min-width: 640px)').matches) {
        openChat();
        return;
      }
      const ctx = getPageContext(pathname);
      const text = firstOfVisit ? greeting.text : ctx?.greet || 'Anything I can help you find? Ask me about websites, SEO, ads or pricing.';
      setTeaser({ text, chips: greeting.chips.slice(0, 2), kind: 'page' });
    }, AUTO_OPEN_DELAY);
    return () => clearTimeout(timer);
  }, [hidden, introDone, pathname, openChat]);

  // ── Offer help when a visitor seems stuck ──
  const nudge = useCallback((kind) => {
    if (openRef.current || nudgedPathsRef.current.has(pathname)) return;
    const count = Number(sessionGet(SESSION_NUDGES) || 0);
    if (count >= MAX_NUDGES_PER_SESSION) return;
    nudgedPathsRef.current.add(pathname);
    sessionSet(SESSION_NUDGES, String(count + 1));
    setTeaser({ ...NUDGES[kind], kind });
  }, [pathname]);

  useEffect(() => {
    if (hidden || !introDone) return;
    const isOwn = (el) => el?.closest?.('[data-niya]');
    let idleTimer;
    let formTimer;
    const enteredAt = Date.now();
    const clicks = [];

    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => nudge('idle'), IDLE_MS);
    };
    // Several fast clicks on the same spot usually mean something did not respond.
    const onClick = (e) => {
      resetIdle();
      if (isOwn(e.target)) return;
      const now = Date.now();
      clicks.push({ x: e.clientX, y: e.clientY, t: now });
      while (clicks.length && now - clicks[0].t > 1000) clicks.shift();
      const near = clicks.filter((c) => Math.abs(c.x - e.clientX) < 40 && Math.abs(c.y - e.clientY) < 40);
      if (near.length >= 3) { clicks.length = 0; nudge('rage'); }
    };
    // Mouse leaving through the top of the window (towards the tabs / close button).
    const onMouseOut = (e) => {
      if (e.relatedTarget || e.clientY > 0 || Date.now() - enteredAt < 15000 || sessionGet(SESSION_EXIT)) return;
      if (!window.matchMedia('(min-width: 1024px)').matches) return;
      sessionSet(SESSION_EXIT, '1');
      nudge('exit');
    };
    // Typed into a form, then nothing for a while and no submit.
    const onFormInput = (e) => {
      if (isOwn(e.target) || !e.target.closest?.('form')) return;
      clearTimeout(formTimer);
      formTimer = setTimeout(() => nudge('form'), FORM_IDLE_MS);
    };
    const onSubmit = (e) => { if (!isOwn(e.target)) clearTimeout(formTimer); };

    const passive = { passive: true };
    resetIdle();
    window.addEventListener('scroll', resetIdle, passive);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle, passive);
    document.addEventListener('click', onClick, true);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('input', onFormInput, true);
    document.addEventListener('submit', onSubmit, true);
    return () => {
      clearTimeout(idleTimer);
      clearTimeout(formTimer);
      window.removeEventListener('scroll', resetIdle, passive);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle, passive);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('input', onFormInput, true);
      document.removeEventListener('submit', onSubmit, true);
    };
  }, [hidden, introDone, nudge]);

  if (hidden) return null;

  const speak = (reply) => {
    if (!voiceOnRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(toSpeech(reply.speak || reply.text));
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'en-IN';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const stepReply = (i) => ({
    text: LEAD_STEPS[i].q,
    chips: [...(LEAD_STEPS[i].chips || []), 'Cancel'],
  });

  // Guided questions: answers stay in this browser until the visitor taps "Send on WhatsApp".
  const answerLead = (text) => {
    const lead = leadRef.current;
    if (isCancel(text)) {
      leadRef.current = null;
      return { text: "No problem, I've stopped. Ask me anything else.", chips: buildGreeting(pathname).chips };
    }
    lead.answers[LEAD_STEPS[lead.step].key] = text;
    if (LEAD_STEPS[lead.step].key === 'name') writeMemory({ name: text.split(' ')[0].slice(0, 30) });
    lead.step += 1;
    if (lead.step >= LEAD_STEPS.length) {
      leadRef.current = null;
      return buildLeadSummary(lead.answers);
    }
    return stepReply(lead.step);
  };

  // When Niya was unsure and the visitor then picks a topic, share that choice so Niya learns the phrase.
  const learnFromChoice = (topicId) => {
    const phrase = pendingLearnRef.current;
    pendingLearnRef.current = null;
    if (!phrase || !topicId || NOT_INTERESTS.has(topicId)) return;
    fetch('/api/public/niya', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phrase, topic: topicId }),
      keepalive: true,
    }).catch(() => {});
  };

  const rememberInterest = (topicId) => {
    if (!topicId || NOT_INTERESTS.has(topicId)) return;
    const memory = readMemory();
    const interests = { ...(memory.interests || {}) };
    interests[topicId] = (interests[topicId] || 0) + 1;
    writeMemory({ interests });
  };

  const send = (raw, { fromChip = false } = {}) => {
    const text = String(raw || '').trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const inLead = Boolean(leadRef.current);
      const reply = inLead ? answerLead(text) : getReply(text, { path: pathname, learned: learnedRef.current });
      if (!inLead) {
        if (fromChip) learnFromChoice(reply.id);
        else pendingLearnRef.current = reply.confidence === 'high' ? null : text;
        rememberInterest(reply.id);
      }
      const replies = [reply];
      if (reply.action === 'lead') {
        leadRef.current = { step: 0, answers: {} };
        replies.push(stepReply(0));
      }
      setMessages((m) => [...m, ...replies.map((r) => ({ from: 'bot', id: r.id, text: r.text, links: r.links, chips: r.chips }))]);
      setTyping(false);
      speak({ text: replies.map((r) => r.speak || r.text).join(' ') });
    }, 550);
  };

  const fromTeaser = (chip) => {
    setTeaser(null);
    openChat();
    if (chip) setTimeout(() => send(chip, { fromChip: true }), 50);
  };

  const toggleListening = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    if (listening) { recognitionRef.current?.stop(); return; }
    window.speechSynthesis?.cancel();
    const rec = new Recognition();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => send(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  const toggleVoice = () => {
    if (voiceOn) window.speechSynthesis?.cancel();
    setVoiceOn((v) => !v);
  };

  const lastBotIndex = messages.map((m) => m.from).lastIndexOf('bot');

  return (
    <div data-niya className="fixed bottom-[9.25rem] right-4 sm:bottom-[6.25rem] sm:right-6 z-[60] flex flex-col items-end pointer-events-none">
      {/* Teaser bubble: first-visit hello on phones, or an offer of help when a visitor seems stuck */}
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto mb-3 w-[min(300px,calc(100vw-2rem))] origin-bottom-right rounded-2xl border border-primary/15 bg-surface-container-lowest shadow-xl p-3.5"
          >
            <div className="flex items-start gap-2.5">
              <NiyaAvatar />
              <button type="button" onClick={() => fromTeaser()} className="flex-1 min-w-0 text-left cursor-pointer">
                <span className="block text-xs font-bold text-on-surface">{BOT_NAME}</span>
                <span className="block text-sm text-main-text leading-snug mt-0.5">{teaser.text}</span>
              </button>
              <button
                type="button"
                onClick={() => setTeaser(null)}
                aria-label="Dismiss message"
                className="h-7 w-7 -mt-1 -mr-1 shrink-0 flex items-center justify-center rounded-full text-text-light hover:text-on-surface hover:bg-primary/5 cursor-pointer"
              >
                <X size={14} weight="bold" />
              </button>
            </div>
            {teaser.chips?.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 pl-[2.6rem]">
                {teaser.chips.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => fromTeaser(c)}
                    className="rounded-full border border-primary/25 bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`${BOT_NAME}, InfronixWeb chat assistant`}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto mb-3 w-[calc(100vw-2rem)] sm:w-[380px] h-[min(540px,calc(100svh-18.5rem))] sm:h-[min(540px,calc(100svh-15.5rem))] lg:h-[min(540px,calc(100svh-19rem))] min-h-[300px] origin-bottom-right flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-surface-container-lowest shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F6F3FF] border-b border-primary/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative">
                  <NiyaAvatar size="w-10 h-10" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#F6F3FF]" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-heading font-bold text-sm text-on-surface leading-tight">{BOT_NAME}</p>
                  <p className="text-[11px] text-text-light leading-tight">InfronixWeb assistant · replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {canSpeak && (
                  <button
                    type="button"
                    onClick={toggleVoice}
                    aria-pressed={voiceOn}
                    aria-label={voiceOn ? 'Turn voice replies off' : 'Turn voice replies on'}
                    title={voiceOn ? 'Voice on' : 'Voice off'}
                    className={`h-9 w-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${voiceOn ? 'text-primary bg-primary/10 hover:bg-primary/15' : 'text-text-light hover:bg-primary/5'}`}
                  >
                    {voiceOn ? <SpeakerHigh size={18} weight="fill" /> : <SpeakerSlash size={18} weight="fill" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="h-9 w-9 flex items-center justify-center rounded-full text-text-light hover:text-on-surface hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 bg-surface" aria-live="polite">
              {messages.map((msg, i) => (
                msg.from === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[80%] rounded-2xl rounded-br-md bg-primary text-white text-sm px-3.5 py-2.5 leading-relaxed">{msg.text}</p>
                  </div>
                ) : (
                  <div key={i} className="flex items-end gap-2">
                    <NiyaAvatar />
                    <div className="max-w-[85%] min-w-0">
                      <p className="rounded-2xl rounded-bl-md bg-surface-container-lowest border border-outline text-sm text-main-text px-3.5 py-2.5 leading-relaxed whitespace-pre-line">{msg.text}</p>
                      {msg.links?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.links.map((l) => {
                            const external = /^(https?:|tel:|mailto:)/.test(l.href);
                            const cls = 'inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 text-xs font-semibold transition-colors';
                            return external ? (
                              <a key={l.href} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={cls}>
                                {l.label} <ArrowUpRight size={11} weight="bold" />
                              </a>
                            ) : (
                              <Link key={l.href} href={l.href} className={cls}>
                                {l.label} <ArrowUpRight size={11} weight="bold" />
                              </Link>
                            );
                          })}
                        </div>
                      )}
                      {i === lastBotIndex && !typing && msg.chips?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.chips.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => send(c, { fromChip: true })}
                              className="rounded-full border border-primary/25 bg-surface-container-lowest text-on-surface hover:border-primary hover:text-primary px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}
              {typing && (
                <div className="flex items-end gap-2" aria-label={`${BOT_NAME} is typing`}>
                  <NiyaAvatar />
                  <span className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-surface-container-lowest border border-outline px-3.5 py-3">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-text-light animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 border-t border-outline bg-surface-container-lowest px-3 py-3"
            >
              {canListen && (
                <button
                  type="button"
                  onClick={toggleListening}
                  aria-pressed={listening}
                  aria-label={listening ? 'Stop listening' : 'Ask by voice'}
                  title={listening ? 'Listening…' : 'Ask by voice'}
                  className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-full transition-colors cursor-pointer ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/15'}`}
                >
                  <Microphone size={18} weight="fill" />
                </button>
              )}
              <label htmlFor="chatbot-input" className="sr-only">Type your question</label>
              <input
                id="chatbot-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? 'Listening…' : `Ask ${BOT_NAME} anything…`}
                autoComplete="off"
                maxLength={300}
                className="flex-1 min-w-0 h-10 rounded-full border border-outline bg-surface px-4 text-sm text-on-surface placeholder:text-text-light focus:outline-none focus:border-primary/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <PaperPlaneRight size={17} weight="fill" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-expanded={open}
        aria-label={open ? `Close ${BOT_NAME}` : `Chat with ${BOT_NAME}`}
        title={`Ask ${BOT_NAME}`}
        className={`pointer-events-auto relative w-16 h-16 rounded-full text-white flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(109,40,217,0.6)] border-[3px] border-primary transition-transform duration-300 hover:scale-110 cursor-pointer ${open ? 'bg-primary hover:bg-primary-dark' : 'bg-soft-violet'}`}
      >
        {open ? (
          <X size={24} weight="bold" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/niya-avatar-192.webp" alt="" width={192} height={192} className="w-full h-full rounded-full object-cover bg-soft-violet" />
        )}
        {teaser && !open && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-white" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
