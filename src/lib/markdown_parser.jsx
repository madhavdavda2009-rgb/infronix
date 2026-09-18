import React from 'react';

/**
 * Calculates reading time in minutes based on 200 words per minute average.
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
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/`{3}[\s\S]*?`{3}/g, '') // code blocks
    .replace(/`(.+?)`/g, '$1') // inline code
    .replace(/^>\s+/gm, '') // quotes
    .replace(/^[-*+]\s+/gm, '') // lists
    .replace(/^\d+\.\s+/gm, '') // numbered lists
    .replace(/\n+/g, ' ') // whitespace
    .trim();
}

/**
 * Safe inline markdown tokenizer returning array of React nodes.
 */
function renderInline(text, keyPrefix = 'in') {
  if (!text) return null;

  // Tokenize bold, italic, code, links
  const tokens = [];
  let remaining = text;
  let idx = 0;

  while (remaining.length > 0) {
    // 1. Image: ![alt](url)
    const imgMatch = remaining.match(/^!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      const safeSrc = src.startsWith('javascript:') ? '#' : src;
      tokens.push(
        <span key={`${keyPrefix}-img-${idx++}`} className="block my-6">
          <img
            src={safeSrc}
            alt={alt}
            className="w-full rounded-xl border border-outline-variant/50 max-h-[500px] object-cover"
            loading="lazy"
          />
          {alt && <span className="block text-xs text-center text-text-light mt-2 italic">{alt}</span>}
        </span>
      );
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // 2. Link: [text](url)
    const linkMatch = remaining.match(/^\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      let href = linkMatch[2].trim();
      if (href.startsWith('javascript:')) href = '#';
      const isExternal = href.startsWith('http://') || href.startsWith('https://');

      tokens.push(
        <a
          key={`${keyPrefix}-a-${idx++}`}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline font-semibold underline-offset-4"
        >
          {renderInline(linkText, `${keyPrefix}-l-${idx}`)}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // 3. Bold: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      tokens.push(
        <strong key={`${keyPrefix}-b-${idx++}`} className="font-bold text-on-surface">
          {renderInline(boldMatch[2], `${keyPrefix}-sub-${idx}`)}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 4. Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
    if (italicMatch) {
      tokens.push(
        <em key={`${keyPrefix}-i-${idx++}`} className="italic">
          {renderInline(italicMatch[2], `${keyPrefix}-sub-${idx}`)}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 5. Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push(
        <code
          key={`${keyPrefix}-c-${idx++}`}
          className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono text-xs border border-outline-variant/40"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Plain text chunk up to next special markdown character
    const nextSpecial = remaining.search(/(\!\[|\[|\*\*|__|\*|_|`)/);
    if (nextSpecial === -1) {
      tokens.push(remaining);
      break;
    } else if (nextSpecial === 0) {
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
 * Parses markdown blocks and returns safe React components.
 */
export function SafeMarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Code Block: ```lang ... ```
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
        <div key={`block-code-${i}`} className="my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-md">
          {lang && (
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900 text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
              {lang}
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Headings: # H1, ## H2, ### H3, #### H4
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-lg sm:text-xl font-heading font-bold text-on-surface mt-8 mb-3">
          {renderInline(trimmed.slice(5), `h4-${i}`)}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl sm:text-2xl font-heading font-bold text-on-surface mt-10 mb-4">
          {renderInline(trimmed.slice(4), `h3-${i}`)}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl sm:text-3xl font-heading font-bold text-on-surface mt-12 mb-4 border-b border-outline-variant/30 pb-2">
          {renderInline(trimmed.slice(3), `h2-${i}`)}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={`h1-${i}`} className="text-3xl sm:text-4xl font-heading font-bold text-on-surface mt-12 mb-4">
          {renderInline(trimmed.slice(2), `h1-${i}`)}
        </h2>
      );
      i++;
      continue;
    }

    // 3. Blockquote: > Quote
    if (trimmed.startsWith('> ')) {
      const quoteLines = [trimmed.slice(2)];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <blockquote key={`quote-${i}`} className="my-6 pl-4 sm:pl-6 border-l-4 border-primary bg-surface-container-lowest py-3 pr-4 rounded-r-xl italic text-main-text text-base sm:text-lg">
          {quoteLines.map((ql, qIdx) => (
            <p key={`ql-${qIdx}`} className="my-1">
              {renderInline(ql, `q-${i}-${qIdx}`)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 4. Horizontal Divider: --- or ***
    if (/^(\-{3,}|\*{3,}|\_{3,})$/.test(trimmed)) {
      elements.push(
        <hr key={`hr-${i}`} className="my-10 border-t border-outline-variant/60" />
      );
      i++;
      continue;
    }

    // 5. Unordered List: - or *
    if (/^[-*+]\s+/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-5 pl-6 space-y-2 list-disc text-main-text text-sm sm:text-base marker:text-primary">
          {listItems.map((item, lIdx) => (
            <li key={`li-${lIdx}`} className="leading-relaxed">
              {renderInline(item, `ul-${i}-${lIdx}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 6. Ordered List: 1. 2. 3.
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-5 pl-6 space-y-2 list-decimal text-main-text text-sm sm:text-base marker:font-bold marker:text-primary">
          {listItems.map((item, lIdx) => (
            <li key={`oli-${lIdx}`} className="leading-relaxed">
              {renderInline(item, `ol-${i}-${lIdx}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 7. Regular Paragraph
    const paraLines = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('> ') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('* ') &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(\-{3,}|\*{3,}|\_{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    elements.push(
      <p key={`p-${i}`} className="my-4 text-main-text text-sm sm:text-base md:text-lg leading-relaxed font-normal">
        {renderInline(paraLines.join(' '), `p-${i}`)}
      </p>
    );
  }

  return <div className={`blog-prose space-y-2 ${className}`}>{elements}</div>;
}
