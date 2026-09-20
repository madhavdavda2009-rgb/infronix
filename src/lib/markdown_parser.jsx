"use client";
import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Info, 
  Lightbulb, 
  Warning, 
  WarningCircle, 
  ShieldCheck,
  ArrowSquareOut
} from '@phosphor-icons/react';

/**
 * Calculates reading time in minutes based on ~200 words per minute average.
 */
export function calculateReadingTime(text) {
  if (!text || typeof text !== 'string') return 1;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Strips markdown to pure plain text for excerpts or SEO summaries.
 */
export function stripMarkdown(markdown) {
  if (!markdown) return '';
  return markdown
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/(\*\*\*|___)(.*?)\1/g, '$2') // bold italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/~~(.*?)~~/g, '$1') // strikethrough
    .replace(/==(.*?)==/g, '$1') // highlight
    .replace(/`{3}[\s\S]*?`{3}/g, '') // code blocks
    .replace(/`(.+?)`/g, '$1') // inline code
    .replace(/^>\s+/gm, '') // quotes
    .replace(/^[-*+]\s+/gm, '') // lists
    .replace(/^\d+\.\s+/gm, '') // numbered lists
    .replace(/\|.*?\|/g, ' ') // tables
    .replace(/\n+/g, ' ') // whitespace
    .trim();
}

/**
 * Code Block with Copy Button
 */
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] text-slate-100 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800 text-xs">
        <span className="font-mono text-slate-400 font-bold uppercase tracking-wider">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Alert / Callout Box
 */
function CalloutBox({ type, lines, keyPrefix }) {
  const configs = {
    note: {
      icon: Info,
      title: 'Note',
      border: 'border-blue-500/80',
      bg: 'bg-blue-50/70 dark:bg-blue-950/20',
      text: 'text-blue-900 dark:text-blue-200',
      iconColor: 'text-blue-600'
    },
    tip: {
      icon: Lightbulb,
      title: 'Tip',
      border: 'border-emerald-500/80',
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
      text: 'text-emerald-900 dark:text-emerald-200',
      iconColor: 'text-emerald-600'
    },
    important: {
      icon: ShieldCheck,
      title: 'Important',
      border: 'border-violet-500/80',
      bg: 'bg-violet-50/70 dark:bg-violet-950/20',
      text: 'text-violet-900 dark:text-violet-200',
      iconColor: 'text-violet-600'
    },
    warning: {
      icon: Warning,
      title: 'Warning',
      border: 'border-amber-500/80',
      bg: 'bg-amber-50/70 dark:bg-amber-950/20',
      text: 'text-amber-900 dark:text-amber-200',
      iconColor: 'text-amber-600'
    },
    caution: {
      icon: WarningCircle,
      title: 'Caution',
      border: 'border-rose-500/80',
      bg: 'bg-rose-50/70 dark:bg-rose-950/20',
      text: 'text-rose-900 dark:text-rose-200',
      iconColor: 'text-rose-600'
    }
  };

  const cfg = configs[type.toLowerCase()] || configs.note;
  const IconComponent = cfg.icon;

  return (
    <div className={`my-6 p-4 sm:p-5 rounded-2xl border-l-4 ${cfg.border} ${cfg.bg} shadow-xs`}>
      <div className="flex items-center gap-2 mb-2">
        <IconComponent size={18} weight="bold" className={cfg.iconColor} />
        <span className={`text-xs font-bold uppercase tracking-wider ${cfg.iconColor}`}>
          {cfg.title}
        </span>
      </div>
      <div className={`text-sm leading-relaxed ${cfg.text} space-y-1.5`}>
        {lines.map((l, idx) => (
          <p key={`${keyPrefix}-cl-${idx}`}>{renderInline(l, `${keyPrefix}-cli-${idx}`)}</p>
        ))}
      </div>
    </div>
  );
}

/**
 * Safe inline markdown tokenizer returning array of React nodes.
 */
export function renderInline(text, keyPrefix = 'in') {
  if (!text) return null;
  if (typeof text !== 'string') return String(text);

  const tokens = [];
  let remaining = text;
  let idx = 0;

  while (remaining.length > 0) {
    // 1. Image: ![alt](url "title")
    const imgMatch = remaining.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/);
    if (imgMatch) {
      const alt = imgMatch[1] || '';
      let src = imgMatch[2].trim();
      const title = imgMatch[3] || alt;
      if (src.toLowerCase().startsWith('javascript:')) src = '#';
      tokens.push(
        <img
          key={`${keyPrefix}-img-${idx++}`}
          src={src}
          alt={alt}
          title={title}
          className="inline-block max-w-full rounded-xl my-2 border border-outline-variant/50"
          loading="lazy"
        />
      );
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // 2. Link: [text](url)
    const linkMatch = remaining.match(/^\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      let href = linkMatch[2].trim();
      if (href.toLowerCase().startsWith('javascript:')) href = '#';
      const isExternal = href.startsWith('http://') || href.startsWith('https://');

      tokens.push(
        <a
          key={`${keyPrefix}-a-${idx++}`}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline font-semibold underline-offset-4 inline-flex items-center gap-0.5"
        >
          <span>{renderInline(linkText, `${keyPrefix}-l-${idx}`)}</span>
          {isExternal && <ArrowSquareOut size={12} className="inline opacity-70" />}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // 3. Bold + Italic: ***text*** or ___text___
    const boldItalicMatch = remaining.match(/^(\*\*\*|___)(.+?)\1/);
    if (boldItalicMatch) {
      tokens.push(
        <strong key={`${keyPrefix}-bi-${idx++}`} className="font-bold italic text-on-surface">
          {renderInline(boldItalicMatch[2], `${keyPrefix}-sub-${idx}`)}
        </strong>
      );
      remaining = remaining.slice(boldItalicMatch[0].length);
      continue;
    }

    // 4. Bold: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/);
    if (boldMatch) {
      tokens.push(
        <strong key={`${keyPrefix}-b-${idx++}`} className="font-bold text-on-surface">
          {renderInline(boldMatch[2], `${keyPrefix}-sub-${idx}`)}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 5. Italic: *text* (word boundary or space guarded to avoid messing with file_names)
    const italicMatch = remaining.match(/^(\*)(?!\s)(.+?)(?<!\s)\1/);
    if (italicMatch) {
      tokens.push(
        <em key={`${keyPrefix}-i-${idx++}`} className="italic">
          {renderInline(italicMatch[2], `${keyPrefix}-sub-${idx}`)}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 6. Strikethrough: ~~text~~
    const strikeMatch = remaining.match(/^~~(.+?)~~/);
    if (strikeMatch) {
      tokens.push(
        <del key={`${keyPrefix}-del-${idx++}`} className="line-through text-text-light opacity-80">
          {renderInline(strikeMatch[1], `${keyPrefix}-sub-${idx}`)}
        </del>
      );
      remaining = remaining.slice(strikeMatch[0].length);
      continue;
    }

    // 7. Highlight / Mark: ==text==
    const markMatch = remaining.match(/^==(.+?)==/);
    if (markMatch) {
      tokens.push(
        <mark key={`${keyPrefix}-mark-${idx++}`} className="bg-amber-200/80 text-amber-950 px-1 py-0.5 rounded font-medium">
          {renderInline(markMatch[1], `${keyPrefix}-sub-${idx}`)}
        </mark>
      );
      remaining = remaining.slice(markMatch[0].length);
      continue;
    }

    // 8. Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push(
        <code
          key={`${keyPrefix}-c-${idx++}`}
          className="px-1.5 py-0.5 rounded-md bg-surface-container-highest text-primary font-mono text-xs border border-outline-variant/40"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 9. HTML Break tag: <br> or <br/>
    const brMatch = remaining.match(/^<br\s*\/?>/i);
    if (brMatch) {
      tokens.push(<br key={`${keyPrefix}-br-${idx++}`} />);
      remaining = remaining.slice(brMatch[0].length);
      continue;
    }

    // 10. HTML strong/b/em/i/u/del inline tags
    const htmlInlineMatch = remaining.match(/^<(strong|b|em|i|u|del|code|span)(?:\s+[^>]*?)?>(.*?)<\/\1>/i);
    if (htmlInlineMatch) {
      const tag = htmlInlineMatch[1].toLowerCase();
      const inner = htmlInlineMatch[2];
      const sub = renderInline(inner, `${keyPrefix}-ht-${idx}`);
      if (tag === 'strong' || tag === 'b') {
        tokens.push(<strong key={`${keyPrefix}-hb-${idx++}`} className="font-bold text-on-surface">{sub}</strong>);
      } else if (tag === 'em' || tag === 'i') {
        tokens.push(<em key={`${keyPrefix}-he-${idx++}`} className="italic">{sub}</em>);
      } else if (tag === 'u') {
        tokens.push(<u key={`${keyPrefix}-hu-${idx++}`} className="underline">{sub}</u>);
      } else if (tag === 'del') {
        tokens.push(<del key={`${keyPrefix}-hd-${idx++}`} className="line-through">{sub}</del>);
      } else if (tag === 'code') {
        tokens.push(<code key={`${keyPrefix}-hc-${idx++}`} className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono text-xs">{sub}</code>);
      } else {
        tokens.push(<span key={`${keyPrefix}-hs-${idx++}`}>{sub}</span>);
      }
      remaining = remaining.slice(htmlInlineMatch[0].length);
      continue;
    }

    // 11. HTML Link tag: <a href="...">text</a>
    const htmlLinkMatch = remaining.match(/^<a\s+[^>]*?href=["']([^"']+)["'][^>]*?>(.*?)<\/a>/i);
    if (htmlLinkMatch) {
      let href = htmlLinkMatch[1];
      const linkText = htmlLinkMatch[2];
      if (href.toLowerCase().startsWith('javascript:')) href = '#';
      const isExternal = href.startsWith('http://') || href.startsWith('https://');

      tokens.push(
        <a
          key={`${keyPrefix}-ha-${idx++}`}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline font-semibold underline-offset-4"
        >
          {renderInline(linkText, `${keyPrefix}-hl-${idx}`)}
        </a>
      );
      remaining = remaining.slice(htmlLinkMatch[0].length);
      continue;
    }

    // Plain text chunk up to next special syntax
    const nextSpecial = remaining.search(/(\!\[|\[|\*\*\*|___|\*\*|__|\*|~~|==|`|<br|<strong|<b|<em|<i|<u|<del|<code|<a|<span)/i);
    if (nextSpecial === -1) {
      tokens.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // If at special char but didn't match any rule above, push char and step forward
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      tokens.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens;
}

/**
 * Parses markdown table lines into a clean table structure.
 */
function parseTable(lines, keyPrefix) {
  if (lines.length < 2) return null;

  const parseRow = (line) => {
    return line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(c => c.trim());
  };

  const headers = parseRow(lines[0]);
  const alignments = parseRow(lines[1]).map(col => {
    if (col.startsWith(':') && col.endsWith(':')) return 'center';
    if (col.endsWith(':')) return 'right';
    return 'left';
  });

  const rows = lines.slice(2).map(parseRow);

  return (
    <div key={keyPrefix} className="my-8 overflow-x-auto rounded-2xl border border-outline-variant/60 shadow-xs bg-surface">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-surface-container-lowest border-b border-outline-variant/60">
            {headers.map((h, hIdx) => (
              <th
                key={`th-${hIdx}`}
                className="py-3 px-4 sm:px-5 font-bold font-heading text-on-surface uppercase tracking-wider text-[11px] sm:text-xs"
                style={{ textAlign: alignments[hIdx] || 'left' }}
              >
                {renderInline(h, `${keyPrefix}-th-${hIdx}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {rows.map((row, rIdx) => (
            <tr key={`tr-${rIdx}`} className="hover:bg-surface-container-lowest/50 transition-colors">
              {row.map((cell, cIdx) => (
                <td
                  key={`td-${rIdx}-${cIdx}`}
                  className="py-3 px-4 sm:px-5 text-main-text leading-relaxed"
                  style={{ textAlign: alignments[cIdx] || 'left' }}
                >
                  {renderInline(cell, `${keyPrefix}-td-${rIdx}-${cIdx}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Universal Safe Markdown & HTML Body Renderer
 */
export function SafeMarkdownRenderer({ content, fallbackExcerpt = '', className = '' }) {
  // Graceful fallback if content is missing
  if (!content || (typeof content === 'string' && !content.trim())) {
    if (fallbackExcerpt && fallbackExcerpt.trim()) {
      return (
        <div className={`blog-prose leading-relaxed space-y-4 ${className}`}>
          <p className="text-base sm:text-lg md:text-xl text-main-text leading-relaxed font-normal">
            {fallbackExcerpt}
          </p>
        </div>
      );
    }
    return null;
  }

  const rawText = typeof content === 'string' ? content : JSON.stringify(content);
  const lines = rawText.replace(/\r\n/g, '\n').split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Code Block: ```lang ... ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      elements.push(
        <CodeBlock
          key={`block-code-${i}`}
          code={codeLines.join('\n')}
          language={lang}
        />
      );
      continue;
    }

    // 3. Standalone Image Line: ![alt](url)
    const singleImgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
    if (singleImgMatch) {
      const alt = singleImgMatch[1];
      let src = singleImgMatch[2].trim();
      const caption = singleImgMatch[3] || alt;
      if (src.toLowerCase().startsWith('javascript:')) src = '#';

      elements.push(
        <figure key={`fig-${i}`} className="my-8 rounded-2xl overflow-hidden border border-outline-variant/60 shadow-md bg-surface">
          <img
            src={src}
            alt={alt}
            className="w-full max-h-[560px] object-cover"
            loading="lazy"
          />
          {caption && (
            <figcaption className="p-3 text-center text-xs text-text-light bg-surface-container-lowest border-t border-outline-variant/40 italic">
              {caption}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // 4. GitHub Alerts & Callouts: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
    const alertMatch = trimmed.match(/^>\s*\[\!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (alertMatch) {
      const alertType = alertMatch[1].toLowerCase();
      const alertLines = [];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        alertLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      elements.push(
        <CalloutBox
          key={`alert-${i}`}
          type={alertType}
          lines={alertLines}
          keyPrefix={`alert-${i}`}
        />
      );
      continue;
    }

    // 5. Standard Blockquote: > text
    if (trimmed.startsWith('>')) {
      const quoteLines = [trimmed.replace(/^>\s?/, '')];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      elements.push(
        <blockquote key={`quote-${i}`} className="my-8 pl-5 sm:pl-7 border-l-4 border-primary bg-surface-container-lowest py-4 pr-5 rounded-r-2xl italic text-main-text text-base sm:text-lg shadow-xs">
          {quoteLines.map((ql, qIdx) => (
            <p key={`ql-${qIdx}`} className="my-1.5 leading-relaxed">
              {renderInline(ql, `q-${i}-${qIdx}`)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 6. Headings H1 to H6
    if (trimmed.startsWith('#')) {
      const hMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (hMatch) {
        const level = hMatch[1].length;
        const text = hMatch[2];
        const headingId = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

        if (level === 1) {
          elements.push(
            <h2 key={`h1-${i}`} id={headingId} className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-on-surface mt-12 mb-4 leading-tight">
              {renderInline(text, `h1-${i}`)}
            </h2>
          );
        } else if (level === 2) {
          elements.push(
            <h2 key={`h2-${i}`} id={headingId} className="text-2xl sm:text-3xl font-heading font-bold text-on-surface mt-12 mb-4 border-b border-outline-variant/40 pb-3 leading-tight">
              {renderInline(text, `h2-${i}`)}
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3 key={`h3-${i}`} id={headingId} className="text-xl sm:text-2xl font-heading font-bold text-on-surface mt-10 mb-3 leading-snug">
              {renderInline(text, `h3-${i}`)}
            </h3>
          );
        } else if (level === 4) {
          elements.push(
            <h4 key={`h4-${i}`} id={headingId} className="text-lg sm:text-xl font-heading font-bold text-on-surface mt-8 mb-2">
              {renderInline(text, `h4-${i}`)}
            </h4>
          );
        } else {
          elements.push(
            <h5 key={`h5-${i}`} id={headingId} className="text-base sm:text-lg font-heading font-bold text-on-surface mt-6 mb-2">
              {renderInline(text, `h5-${i}`)}
            </h5>
          );
        }
        i++;
        continue;
      }
    }

    // 7. Markdown Tables: | col1 | col2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
      const tableLines = [trimmed];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const tableEl = parseTable(tableLines, `table-${i}`);
      if (tableEl) {
        elements.push(tableEl);
        continue;
      }
    }

    // 8. Horizontal Divider: ---, ***, ___
    if (/^(\-{3,}|\*{3,}|\_{3,})$/.test(trimmed)) {
      elements.push(
        <hr key={`hr-${i}`} className="my-10 sm:my-12 border-t border-outline-variant/60" />
      );
      i++;
      continue;
    }

    // 9. Unordered / Check Lists: - , * , +
    if (/^[-*+]\s+/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        const itemLine = lines[i].trim().replace(/^[-*+]\s+/, '');
        listItems.push(itemLine);
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-5 pl-6 sm:pl-8 space-y-2.5 list-disc text-main-text text-sm sm:text-base marker:text-primary leading-relaxed">
          {listItems.map((item, lIdx) => {
            // Checklist item check: [ ] or [x]
            const checkMatch = item.match(/^\[([ xX])\]\s+(.*)$/);
            if (checkMatch) {
              const isChecked = checkMatch[1].toLowerCase() === 'x';
              return (
                <li key={`cli-${lIdx}`} className="list-none -ml-5 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    readOnly
                    checked={isChecked}
                    className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-0 cursor-default"
                  />
                  <span className={isChecked ? 'line-through text-text-light' : ''}>
                    {renderInline(checkMatch[2], `ul-${i}-${lIdx}`)}
                  </span>
                </li>
              );
            }
            return (
              <li key={`li-${lIdx}`} className="leading-relaxed">
                {renderInline(item, `ul-${i}-${lIdx}`)}
              </li>
            );
          })}
        </ul>
      );
      continue;
    }

    // 10. Ordered List: 1. 2. 3.
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-5 pl-6 sm:pl-8 space-y-2.5 list-decimal text-main-text text-sm sm:text-base marker:font-bold marker:text-primary leading-relaxed">
          {listItems.map((item, lIdx) => (
            <li key={`oli-${lIdx}`} className="leading-relaxed">
              {renderInline(item, `ol-${i}-${lIdx}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 11. HTML Block tags: <div>, <p>, <h3>, etc.
    if (trimmed.startsWith('<') && !trimmed.startsWith('<!')) {
      const htmlHeaderMatch = trimmed.match(/^<h([1-6])(?:\s+[^>]*?)?>(.*?)<\/h\1>/i);
      if (htmlHeaderMatch) {
        const lvl = parseInt(htmlHeaderMatch[1], 10);
        const hText = htmlHeaderMatch[2];
        elements.push(
          <h3 key={`h-html-${i}`} className="text-xl sm:text-2xl font-heading font-bold text-on-surface mt-10 mb-3 leading-snug">
            {renderInline(hText, `h-html-${i}`)}
          </h3>
        );
        i++;
        continue;
      }
    }

    // 12. Standard Paragraph Chunk
    const paraLines = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('* ') &&
      !lines[i].trim().startsWith('+ ') &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(\-{3,}|\*{3,}|\_{3,})$/.test(lines[i].trim()) &&
      !(lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) &&
      !lines[i].trim().match(/^!\[(.*?)\]\((.*?)\)$/)
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    elements.push(
      <p key={`p-${i}`} className="my-5 text-main-text text-sm sm:text-base md:text-lg leading-relaxed font-normal">
        {renderInline(paraLines.join(' '), `p-${i}`)}
      </p>
    );
  }

  return (
    <div className={`blog-prose space-y-2 leading-relaxed text-main-text ${className}`}>
      {elements}
    </div>
  );
}
