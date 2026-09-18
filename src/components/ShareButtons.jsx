"use client";
import React, { useState } from 'react';
import { 
  LinkedinLogo, 
  XLogo, 
  WhatsappLogo, 
  LinkSimple, 
  Check 
} from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

export default function ShareButtons({ title, slug }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${slug}`
    : `https://www.infronixweb.in/blog/${slug}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      showToast('Article link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-wider text-text-light mr-2">
        Share Article:
      </span>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/50 text-text-light hover:text-primary transition-all flex items-center justify-center shadow-xs cursor-pointer"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <LinkedinLogo size={18} weight="fill" />
      </a>

      {/* Twitter / X */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-outline-variant/60 hover:border-on-surface text-text-light hover:text-on-surface transition-all flex items-center justify-center shadow-xs cursor-pointer"
        aria-label="Share on X"
        title="Share on X"
      >
        <XLogo size={18} weight="bold" />
      </a>

      {/* WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-xl bg-surface-container-lowest border border-outline-variant/60 hover:border-emerald-500 text-text-light hover:text-emerald-600 transition-all flex items-center justify-center shadow-xs cursor-pointer"
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
      >
        <WhatsappLogo size={18} weight="fill" />
      </a>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        className="px-3 h-9 rounded-xl bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/50 text-text-light hover:text-primary transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
        aria-label="Copy Link"
        title="Copy Link to Clipboard"
      >
        {copied ? <Check size={16} className="text-emerald-600" /> : <LinkSimple size={16} />}
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
}
