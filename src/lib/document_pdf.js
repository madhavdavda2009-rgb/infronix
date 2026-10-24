"use client";
import { renderDocumentHtml } from '@/lib/document_templates';

/** Renders a client document off-screen and downloads it as an A4 PDF. */
export async function downloadDocumentPdf(doc) {
  const html2pdf = (await import('html2pdf.js')).default;
  const holder = document.createElement('div');
  holder.style.position = 'fixed';
  holder.style.left = '-10000px';
  holder.style.top = '0';
  holder.style.width = '794px';
  holder.style.background = '#ffffff';
  holder.innerHTML = renderDocumentHtml(doc);
  document.body.appendChild(holder);
  // Wait for the logo so it is not missing from the capture.
  await Promise.all([...holder.querySelectorAll('img')].map(img => (img.complete ? null : new Promise(res => { img.onload = res; img.onerror = res; }))));

  try {
    await html2pdf().set({
      margin: [6, 0, 8, 0],
      filename: `${doc.doc_number || 'document'}-InfronixWeb.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', 'h2', 'li', 'table[role="presentation"]'] }
    }).from(holder.firstElementChild).save();
  } finally {
    document.body.removeChild(holder);
  }
}
