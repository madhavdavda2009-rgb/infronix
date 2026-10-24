import DOMPurify from 'dompurify';

// Browser-only helpers for showing untrusted email HTML. Mail is sanitized with
// DOMPurify and then rendered in a sandboxed iframe (no scripts) with its own
// CSP, so remote content stays blocked even if something slips past the
// sanitizer. Remote images load only when the reader asks for them.

const FORBID_TAGS = [
  'script', 'form', 'input', 'button', 'textarea', 'select', 'option', 'base', 'meta', 'link',
  'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'audio', 'video', 'source', 'track',
  'svg', 'math', 'portal',
];
const FORBID_ATTR = ['action', 'formaction', 'ping', 'srcdoc', 'srcset', 'imagesrcset'];
const REMOTE_URL = /^\s*(https?:)?\/\//i;
const CSS_REMOTE_URL = /url\(\s*['"]?\s*(https?:)?\/\/[^)]*\)/gi;
const HAS_CSS_REMOTE_URL = /url\(\s*['"]?\s*(https?:)?\/\//i;

export function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function textToHtml(text) {
  const escaped = escapeHtml(text);
  const linked = escaped.replace(/\bhttps?:\/\/[^\s<>"]+/g, url => `<a href="${url}">${url}</a>`);
  return `<div style="white-space:pre-wrap">${linked}</div>`;
}

/**
 * @param {string} html raw message HTML
 * @param {object} opts
 * @param {boolean} opts.showImages allow remote images / CSS backgrounds
 * @param {Record<string,string>} opts.cidMap Content-ID -> same-origin attachment URL
 * @param {boolean} opts.forQuote output is inserted into the admin page (reply quote), so drop <style>
 * @returns {{ html: string, blocked: number }}
 */
export function sanitizeEmailHtml(html, { showImages = false, cidMap = {}, forQuote = false } = {}) {
  const purify = DOMPurify(window);
  let blocked = 0;

  purify.addHook('afterSanitizeAttributes', node => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer nofollow');
    }
    for (const attr of ['src', 'background', 'poster']) {
      const value = node.getAttribute(attr);
      if (!value) continue;
      if (/^cid:/i.test(value)) {
        const url = cidMap[value.slice(4).replace(/^<|>$/g, '').trim()];
        if (url) node.setAttribute(attr, url);
        else node.removeAttribute(attr);
      } else if (REMOTE_URL.test(value) && !showImages) {
        node.removeAttribute(attr);
        node.setAttribute('data-iw-blocked', '1');
        blocked += 1;
      }
    }
    const style = node.getAttribute('style');
    if (style && !showImages && HAS_CSS_REMOTE_URL.test(style)) {
      node.setAttribute('style', style.replace(CSS_REMOTE_URL, 'none'));
      blocked += 1;
    }
  });

  purify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'style' && !showImages && !forQuote && HAS_CSS_REMOTE_URL.test(node.textContent || '')) {
      node.textContent = node.textContent.replace(CSS_REMOTE_URL, 'none');
      blocked += 1;
    }
  });

  const clean = purify.sanitize(String(html || ''), {
    FORCE_BODY: true,
    FORBID_TAGS: forQuote ? [...FORBID_TAGS, 'style', 'title'] : FORBID_TAGS,
    FORBID_ATTR,
    ADD_ATTR: ['target'],
    ALLOW_DATA_ATTR: false,
  });
  purify.removeAllHooks();
  return { html: clean, blocked };
}

export function buildEmailDocument(bodyHtml, { showImages = false, origin = '' } = {}) {
  const remote = showImages ? ' https: http:' : '';
  const csp = [
    "default-src 'none'",
    `img-src data: blob: ${origin}${remote}`,
    `style-src 'unsafe-inline'${remote}`,
    `font-src data:${remote}`,
    "script-src 'none'",
    "form-action 'none'",
  ].join('; ');
  return `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<style>
  html,body{margin:0;padding:0;background:#fff}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#1e293b;word-wrap:break-word;overflow-wrap:anywhere;overflow-x:auto}
  img{max-width:100%;height:auto}
  a{color:#7c3aed}
  blockquote{margin:0 0 0 4px;padding-left:12px;border-left:3px solid #e2e8f0;color:#475569}
  pre{white-space:pre-wrap}
  table{max-width:100%}
</style></head><body>${bodyHtml}</body></html>`;
}
