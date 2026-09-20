"use client";
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash, PaperPlaneTilt, CheckCircle, Receipt, Copy, FilePdf, QrCode, Info, Check } from '@phosphor-icons/react';
import { QRCodeSVG } from 'qrcode.react';

export default function InvoiceModal({ client, onClose }) {
  // Extract initial defaults from client / consultation
  const initialServiceName = client?.service || 'Website Development';
  const initialPackagePrice = parseFloat((client?.packagePrice || '').replace(/[^0-9.]/g, '')) || 30000;
  
  // Line items state
  const [items, setItems] = useState([
    {
      description: `${initialServiceName}${client?.package ? ` (${client.package})` : ''} - 50% Upfront Deposit`,
      qty: 1,
      rate: initialPackagePrice * 0.5,
      amount: initialPackagePrice * 0.5
    }
  ]);

  // Invoice metadata
  const [invoiceId, setInvoiceId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(18); // Default 18% GST
  const [amountPaid, setAmountPaid] = useState(0);
  const [manualStatus, setManualStatus] = useState('AUTO'); // AUTO | PAID | PENDING | PARTIALLY PAID
  
  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('UPI / Bank Transfer');
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [clientNotes, setClientNotes] = useState('Work begins upon confirmation of upfront deposit. Balance due upon staging approval before production launch.');

  // UPI Payment Details & QR Code
  const [enableUpi, setEnableUpi] = useState(true);
  const [upiId, setUpiId] = useState('infronixweb@oksbi');
  const [upiPayeeName, setUpiPayeeName] = useState('InfronixWeb Digital Marketing');
  const [upiNote, setUpiNote] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Email modal & loading state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailNote, setEmailNote] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState({ type: '', text: '' });
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    // Generate standard InfronixWeb invoice ID
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const clientNum = (client?.id || Math.floor(Math.random() * 9000 + 1000)).toString().padStart(4, '0');
    const generatedId = `INV-${dateStr}-${clientNum}`;
    setInvoiceId(generatedId);
    setUpiNote(generatedId);

    // Format dates (e.g. "30 Aug 2026")
    const formattedIssue = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    setIssueDate(formattedIssue);

    const due = new Date();
    due.setDate(today.getDate() + 7);
    setDueDate(due.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  }, [client]);

  // Handle line items modifications
  const handleAddItem = () => {
    setItems(prev => [...prev, { description: '', qty: 1, rate: 0, amount: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      const current = { ...updated[index] };

      if (field === 'qty') {
        const qty = parseFloat(value) || 0;
        current.qty = value;
        current.amount = qty * (parseFloat(current.rate) || 0);
      } else if (field === 'rate') {
        const rate = parseFloat(value) || 0;
        current.rate = value;
        current.amount = (parseFloat(current.qty) || 0) * rate;
      } else if (field === 'description') {
        current.description = value;
      }

      updated[index] = current;
      return updated;
    });
  };

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const taxAmount = (subtotal * (parseFloat(taxRate) || 0)) / 100;
  const total = subtotal + taxAmount;
  const paidVal = parseFloat(amountPaid) || 0;
  const balanceDue = Math.max(0, total - paidVal);

  // Derive dynamic payment status
  const derivedStatus = manualStatus !== 'AUTO' 
    ? manualStatus 
    : (paidVal >= total && total > 0 ? 'PAID' : (paidVal > 0 ? 'PARTIALLY PAID' : 'PENDING'));

  // UPI deep link string for instant QR Code generation
  const upiPayAmount = balanceDue > 0 ? balanceDue : total;
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId.trim())}&pn=${encodeURIComponent(upiPayeeName.trim())}&am=${upiPayAmount > 0 ? upiPayAmount.toFixed(2) : '0.00'}&cu=INR&tn=${encodeURIComponent(upiNote || invoiceId)}`;

  // Trigger Direct PDF Download via html2pdf.js
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.querySelector('.print-invoice-root');
      if (!element) return;

      // Temporarily make the print container visible for capture
      element.style.display = 'block';
      element.style.position = 'static';
      element.style.width = '210mm';
      element.style.height = 'auto';
      element.style.background = '#ffffff';
      element.style.padding = '12mm 15mm';

      const opt = {
        margin: 0,
        filename: `${invoiceId}-InfronixWeb-Invoice.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();

      // Restore hidden state
      element.style.display = '';
      element.style.position = '';
      element.style.width = '';
      element.style.height = '';
      element.style.background = '';
      element.style.padding = '';
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Copy Summary text for WhatsApp/Message
  const handleCopySummary = () => {
    const summary = `*INFRONIXWEB DIGITAL MARKETING — INVOICE ${invoiceId}*
Client: ${client?.firstName} ${client?.lastName}
Total Amount: ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Amount Paid: ₹${paidVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Balance Due: ₹${balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Status: ${derivedStatus}
Due Date: ${dueDate}
${enableUpi && upiId ? `Pay via UPI VPA: ${upiId}\n` : ''}Online Invoice & Terms: https://www.infronixweb.in/terms-and-conditions`;

    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Copy UPI ID helper
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Send Invoice Email to Client
  const handleSendInvoiceEmail = async () => {
    setSendingEmail(true);
    setEmailStatusMessage({ type: '', text: '' });

    const invoicePayload = {
      invoiceId,
      issueDate,
      dueDate,
      status: derivedStatus,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      amountPaid: paidVal,
      balanceDue,
      paymentMethod,
      transactionId,
      paymentDate,
      enableUpi,
      upiId,
      upiPayeeName,
      upiAmount: upiPayAmount,
      notes: clientNotes
    };

    try {
      const res = await fetch('/api/admin/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client,
          invoice: invoicePayload,
          customMessage: emailNote
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStatusMessage({ type: 'success', text: `Invoice email successfully sent to ${client.email}!` });
        setTimeout(() => {
          setIsEmailModalOpen(false);
          setEmailStatusMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setEmailStatusMessage({ type: 'error', text: data.error || 'Failed to dispatch invoice email via Hostinger.' });
      }
    } catch (err) {
      setEmailStatusMessage({ type: 'error', text: 'Error connecting to invoice mailer service.' });
    } finally {
      setSendingEmail(false);
    }
  };

  // Status Badge Styles
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'PARTIALLY PAID':
        return 'bg-sky-50 text-sky-700 border-sky-300';
      case 'PENDING':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  return (
    <>
      {/* 
        A4 PRINT / PDF CONTAINER (Targeted when triggering PDF save)
      */}
      <div className="hidden print:block fixed inset-0 z-[99999] bg-white text-slate-900 p-0 m-0 print-invoice-root">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            body {
              background: #ffffff !important;
              color: #0f172a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-invoice-root {
              display: block !important;
              position: static !important;
              width: 100% !important;
              height: auto !important;
              background: #ffffff !important;
            }
          }
        `}} />

        <div className="w-full max-w-[21cm] mx-auto bg-white text-slate-900 font-sans leading-normal">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-slate-100 flex items-center justify-center p-2 rounded shrink-0 border border-slate-200">
                <img 
                  src="/light-web-logo.webp" 
                  alt="InfronixWeb" 
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
                  INFRONIXWEB DIGITAL MARKETING
                </h1>
                <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                  Web Development &middot; SEO &middot; AI Automation
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  www.infronixweb.in &middot; support@infronixweb.in
                </p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900 font-serif">
                INVOICE
              </h2>
              <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{invoiceId}</p>
              <div className="mt-1.5 inline-block">
                <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border rounded ${getStatusBadge(derivedStatus)}`}>
                  {derivedStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Bill To / From & Metadata */}
          <div className="grid grid-cols-3 gap-6 py-6 border-b border-slate-200 text-xs">
            {/* Bill To */}
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1 text-[10px]">
                Billed To
              </span>
              <p className="font-bold text-sm text-slate-900">{client?.firstName} {client?.lastName}</p>
              {client?.company && <p className="font-medium text-slate-700 mt-0.5">{client.company}</p>}
              <p className="text-slate-600 mt-0.5">{client?.email}</p>
              {client?.phone && <p className="text-slate-600">{client.phone}</p>}
            </div>

            {/* Issued By */}
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1 text-[10px]">
                Issued By
              </span>
              <p className="font-bold text-sm text-slate-900">InfronixWeb Digital Marketing</p>
              <p className="text-slate-600 mt-0.5">support@infronixweb.in</p>
              <p className="text-slate-600">Sanand, Ahmedabad, Gujarat, India</p>
              <p className="text-slate-600 font-medium">GST / Registered Agency</p>
            </div>

            {/* Dates & Reference */}
            <div className="bg-slate-50 p-3 border border-slate-200 rounded space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Issue Date:</span>
                <span className="font-medium text-slate-800">{issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Due Date:</span>
                <span className="font-medium text-slate-800">{dueDate}</span>
              </div>
              {client?.service && (
                <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                  <span className="text-slate-500 font-semibold">Service:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[120px]">{client.service}</span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3 w-1/2">Description</th>
                  <th className="py-2.5 px-3 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 text-right w-28">Rate (₹)</th>
                  <th className="py-2.5 px-3 text-right w-32">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-200">
                {items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-3 px-3 font-medium text-slate-800">{item.description || 'Deliverable'}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{item.qty || 1}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      ₹{parseFloat(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      ₹{parseFloat(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Payment Info */}
          <div className="grid grid-cols-2 gap-8 pt-2 pb-6 border-b border-slate-200">
            {/* Payment Details & UPI QR Code */}
            <div className="text-xs space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-500 block text-[10px]">
                Payment Instructions
              </span>
              <div className="bg-slate-50 p-3 border border-slate-200 rounded space-y-1.5">
                <p className="font-bold text-slate-800">Bank Transfer / UPI Accepted</p>
                {paymentMethod && <p className="text-slate-600"><span className="font-semibold">Method:</span> {paymentMethod}</p>}
                {transactionId && <p className="text-slate-600"><span className="font-semibold">Transaction ID:</span> {transactionId}</p>}
                {paymentDate && <p className="text-slate-600"><span className="font-semibold">Payment Date:</span> {paymentDate}</p>}
                <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                  {clientNotes}
                </p>
              </div>

              {/* Printable High-Resolution UPI QR Code */}
              {enableUpi && upiId && (
                <div className="bg-slate-50 p-3 border border-slate-200 rounded flex items-center gap-3.5 mt-2">
                  <div className="bg-white p-1.5 border border-slate-200 rounded shrink-0">
                    <QRCodeSVG
                      value={upiString}
                      size={74}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <div className="text-[10px] text-slate-700 space-y-0.5 leading-tight">
                    <p className="font-bold text-slate-900 text-[11px]">Instant UPI QR Payment</p>
                    <p className="font-mono text-[10px] text-slate-800 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                      {upiId}
                    </p>
                    <p className="text-slate-500 text-[9px] pt-0.5">
                      Scan with GPay, PhonePe, Paytm or any UPI App
                    </p>
                    {upiPayAmount > 0 && (
                      <p className="text-slate-800 font-semibold text-[10px]">
                        Pay Amount: ₹{upiPayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-semibold">Subtotal:</span>
                <span className="font-mono font-semibold text-slate-800">
                  ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-semibold">Tax ({taxRate}%):</span>
                <span className="font-mono font-semibold text-slate-800">
                  ₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-y-2 border-slate-900 font-bold text-sm">
                <span className="uppercase tracking-wider text-slate-900">Total:</span>
                <span className="font-mono text-base text-slate-900">
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {paidVal > 0 && (
                <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                  <span>Amount Paid:</span>
                  <span className="font-mono">- ₹{paidVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 font-bold text-sm bg-slate-100 px-2 rounded">
                <span className="text-slate-900 uppercase tracking-wider">Balance Due:</span>
                <span className="font-mono text-slate-900 text-base">
                  ₹{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="pt-4 text-[10px] text-slate-500 leading-relaxed space-y-1">
            <h4 className="font-bold uppercase tracking-wider text-slate-800 text-[11px] mb-1">
              Terms & Conditions
            </h4>
            <p><strong>1. Payments & Deposits:</strong> Work begins strictly upon deposit confirmation. Deposits reserve your dedicated engineering timeline.</p>
            <p><strong>2. Scope of Services:</strong> This invoice covers the items explicitly listed above. Revisions or features beyond this scope will require additional estimates.</p>
            <p><strong>3. Intellectual Property:</strong> Deliverables ownership transfers upon final receipt of payment. Complete terms apply at <span className="underline text-slate-700">infronixweb.in/terms-and-conditions</span>.</p>
          </div>

          {/* Footer */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
            <div>InfronixWeb Digital Marketing &middot; Thank you for your business.</div>
            <div>Page 1 of 1</div>
          </div>
        </div>
      </div>

      {/* 
        INTERACTIVE ADMIN MODAL STUDIO (Screen view with independent smooth scrolling panes)
      */}
      <div 
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 md:p-6 print:hidden animate-fadeIn overflow-y-auto"
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
      >
        <div 
          className="bg-white border border-slate-200 w-full max-w-7xl h-full md:h-[92vh] md:max-h-[92vh] shadow-2xl flex flex-col overflow-hidden my-auto rounded-none md:rounded-2xl"
          data-lenis-prevent="true"
        >
          {/* Top Bar Header */}
          <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 shrink-0 z-10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-violet-50 border border-violet-200 rounded-xl flex items-center justify-center p-1.5 shrink-0 text-violet-700">
                <Receipt className="text-xl" weight="bold" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-violet-600 uppercase tracking-widest block font-bold">
                  Invoice Studio
                </span>
                <h2 className="text-sm md:text-base text-slate-900 font-bold truncate font-outfit">
                  {client?.firstName} {client?.lastName} {client?.company ? `(${client.company})` : ''}
                </h2>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs uppercase tracking-wider font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                title="Copy Invoice text summary for WhatsApp or message"
              >
                <Copy size={15} />
                <span className="hidden sm:inline">{copiedNotification ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-violet-300 hover:border-violet-400 text-violet-700 text-xs uppercase tracking-wider font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                title="Email Invoice"
              >
                <PaperPlaneTilt size={15} weight="bold" />
                <span className="hidden sm:inline">Email Invoice</span>
              </button>

              {/* Download PDF Option */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={generatingPdf}
                className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-xs ${
                  generatingPdf 
                    ? 'bg-slate-200 text-slate-500 cursor-wait' 
                    : 'bg-violet-600 hover:bg-violet-700 text-white cursor-pointer'
                }`}
                title="Download or Save Invoice as PDF"
              >
                <FilePdf size={16} weight="bold" />
                <span className="hidden sm:inline">{generatingPdf ? 'Generating...' : 'Download PDF'}</span>
              </button>

              <button 
                type="button"
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer ml-1"
                title="Close"
              >
                <X size={20} weight="bold" />
              </button>
            </div>
          </div>

          {/* Main Dual-Pane Studio Body */}
          <div 
            className="flex-1 min-h-0 h-[calc(100vh-56px)] md:h-[calc(92vh-70px)] grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden"
            data-lenis-prevent="true"
          >
            {/* LEFT PANE: Invoice Configurator (5 cols) */}
            <div 
              className="lg:col-span-5 border-r border-slate-200 p-4 md:p-5 overflow-y-auto h-auto lg:h-full lg:max-h-[calc(92vh-70px)] space-y-4 md:space-y-5 bg-slate-50 text-xs text-slate-800 overscroll-contain"
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Metadata row */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs text-violet-700 uppercase tracking-wider font-bold">
                    Invoice Metadata
                  </h4>
                  <span className="font-mono text-[11px] text-slate-500">{invoiceId}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                      Issue Date
                    </label>
                    <input
                      type="text"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                      Due Date
                    </label>
                    <input
                      type="text"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                      Payment Status
                    </label>
                    <select
                      value={manualStatus}
                      onChange={(e) => setManualStatus(e.target.value)}
                      className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 font-bold cursor-pointer"
                    >
                      <option value="AUTO">Auto ({derivedStatus})</option>
                      <option value="PENDING">PENDING</option>
                      <option value="PARTIALLY PAID">PARTIALLY PAID</option>
                      <option value="PAID">PAID</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                      GST / Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 font-medium"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Editor */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs text-violet-700 uppercase tracking-wider font-bold">
                    Line Items ({items.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-violet-600 hover:text-violet-700 uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} weight="bold" /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Deliverable description..."
                          className="w-full bg-white text-slate-900 p-2 text-xs rounded border border-slate-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 font-medium"
                        />
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-slate-200 cursor-pointer shrink-0 transition-colors"
                            title="Delete line item"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-500 block mb-0.5">Qty</label>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                            className="w-full bg-white text-slate-900 p-1.5 rounded border border-slate-300 text-center"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block mb-0.5">Rate (₹)</label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                            className="w-full bg-white text-slate-900 p-1.5 rounded border border-slate-300 text-right font-mono"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block mb-0.5">Amount (₹)</label>
                          <div className="w-full bg-slate-100 p-1.5 rounded border border-slate-200 text-right font-mono font-bold text-slate-900 truncate">
                            ₹{parseFloat(item.amount || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* UPI Instant QR Code Generator Settings */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="text-violet-600 text-base" weight="bold" />
                    <h4 className="text-xs text-violet-700 uppercase tracking-wider font-bold">
                      UPI QR Code Payment
                    </h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableUpi}
                      onChange={(e) => setEnableUpi(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>

                {enableUpi && (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                          UPI VPA ID *
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. name@oksbi"
                          className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 font-mono font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                          Payee Name
                        </label>
                        <input
                          type="text"
                          value={upiPayeeName}
                          onChange={(e) => setUpiPayeeName(e.target.value)}
                          placeholder="InfronixWeb Digital Marketing"
                          className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 font-medium"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 border border-slate-200 rounded-lg flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">QR Target Amount</span>
                        <span className="font-mono text-violet-700 font-bold text-xs">
                          ₹{upiPayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                        {balanceDue > 0 ? 'Syncing Balance Due' : 'Syncing Total'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payments & Deposits */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-xs text-violet-700 uppercase tracking-wider font-bold border-b border-slate-100 pb-2">
                  Payment Collection & Reconciliation
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                      Amount Paid (₹)
                    </label>
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-emerald-700 font-mono font-bold p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                      Payment Method
                    </label>
                    <input
                      type="text"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      placeholder="UPI / NEFT / IMPS"
                      className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                      Transaction / Ref ID
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="TXN-XXXX"
                      className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                      Payment Date
                    </label>
                    <input
                      type="text"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      placeholder="e.g. 30 Aug 2026"
                      className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-semibold">
                    Invoice Notes
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full bg-white text-slate-900 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-violet-600 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Live A4 Document Preview (7 cols - Scrollable) */}
            <div 
              className="lg:col-span-7 bg-slate-100/70 p-4 md:p-8 overflow-y-auto h-auto lg:h-full lg:max-h-[calc(92vh-70px)] flex items-start justify-center overscroll-contain"
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Paper simulation */}
              <div 
                className="w-full max-w-[760px] bg-white text-slate-900 p-5 md:p-10 shadow-lg rounded-xl border border-slate-200/80 font-sans my-auto"
                data-lenis-prevent="true"
              >
                {/* Paper Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start pb-5 md:pb-6 border-b-2 border-slate-900 gap-3 md:gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center p-2 shrink-0 border border-slate-200 shadow-xs">
                      <img 
                        src="/light-web-logo.webp" 
                        alt="InfronixWeb Logo" 
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-base md:text-xl font-bold text-slate-950 font-serif tracking-tight leading-none">
                        INFRONIXWEB DIGITAL MARKETING
                      </h3>
                      <p className="text-[10px] md:text-[11px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
                        Web Development &middot; SEO &middot; AI Automation
                      </p>
                      <p className="text-[10px] md:text-[11px] text-slate-600 mt-0.5">
                        www.infronixweb.in &middot; support@infronixweb.in
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <h4 className="text-base md:text-xl font-bold uppercase tracking-widest text-slate-900 font-serif">
                      INVOICE
                    </h4>
                    <p className="text-[11px] md:text-xs font-mono font-bold text-slate-800 mt-0.5">{invoiceId}</p>
                    <div className="mt-1.5">
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${getStatusBadge(derivedStatus)}`}>
                        {derivedStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bill To & From Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 py-4 md:py-5 border-b border-slate-200 text-xs">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1 text-[10px]">
                      Billed To
                    </span>
                    <p className="font-bold text-slate-900">{client?.firstName} {client?.lastName}</p>
                    {client?.company && <p className="font-medium text-slate-700 mt-0.5">{client.company}</p>}
                    <p className="text-slate-600 mt-0.5">{client?.email}</p>
                    {client?.phone && <p className="text-slate-600">{client.phone}</p>}
                  </div>

                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1 text-[10px]">
                      Issued By
                    </span>
                    <p className="font-bold text-slate-900">InfronixWeb Digital Marketing</p>
                    <p className="text-slate-600 mt-0.5">support@infronixweb.in</p>
                    <p className="text-slate-600">Sanand, Ahmedabad, Gujarat, India</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 border border-slate-200 rounded text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Issue Date:</span>
                      <span className="font-medium text-slate-800">{issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Due Date:</span>
                      <span className="font-medium text-slate-800">{dueDate}</span>
                    </div>
                    {client?.service && (
                      <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                        <span className="text-slate-500 font-semibold">Service:</span>
                        <span className="font-semibold text-slate-900 truncate max-w-[100px]">{client.service}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="py-4 md:py-5 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  <table className="w-full text-left border-collapse text-xs min-w-[400px]">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[9px] md:text-[10px] uppercase tracking-wider font-bold">
                        <th className="py-2 px-2 md:py-2.5 md:px-3">Description</th>
                        <th className="py-2 px-2 md:py-2.5 md:px-3 text-center w-12 md:w-14">Qty</th>
                        <th className="py-2 px-2 md:py-2.5 md:px-3 text-right w-20 md:w-24">Rate (₹)</th>
                        <th className="py-2 px-2 md:py-2.5 md:px-3 text-right w-24 md:w-28">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {items.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{item.description || 'Deliverable'}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600">{item.qty || 1}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                            ₹{parseFloat(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{parseFloat(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary & Payment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-2 pb-5 border-b border-slate-200 text-xs">
                  {/* Left: Payment instruction & UPI QR */}
                  <div className="space-y-1.5">
                    <span className="font-bold uppercase tracking-wider text-slate-500 block text-[10px]">
                      Payment Information
                    </span>
                    <div className="bg-slate-50 p-2.5 border border-slate-200 rounded text-[11px] space-y-1">
                      <p className="font-bold text-slate-800">Bank Transfer / UPI Accepted</p>
                      {paymentMethod && <p className="text-slate-600"><span className="font-semibold">Method:</span> {paymentMethod}</p>}
                      {transactionId && <p className="text-slate-600"><span className="font-semibold">Txn ID:</span> {transactionId}</p>}
                      {paymentDate && <p className="text-slate-600"><span className="font-semibold">Date:</span> {paymentDate}</p>}
                      <p className="text-slate-500 text-[10px] pt-1 border-t border-slate-200">
                        {clientNotes}
                      </p>
                    </div>

                    {/* Live UPI QR Code card */}
                    {enableUpi && upiId && (
                      <div className="bg-slate-50 p-2.5 border border-slate-200 rounded flex items-center gap-3 mt-2">
                        <div className="bg-white p-1.5 border border-slate-200 rounded shrink-0 shadow-xs">
                          <QRCodeSVG
                            value={upiString}
                            size={68}
                            level="M"
                            includeMargin={false}
                          />
                        </div>
                        <div className="text-[10px] text-slate-700 space-y-0.5 leading-tight flex-1">
                          <p className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
                            <span>Scan with UPI App</span>
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-800 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[150px]">
                              {upiId}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="text-slate-500 hover:text-slate-800 p-0.5 transition-colors cursor-pointer"
                              title="Copy UPI ID"
                            >
                              {copiedUpi ? <Check size={12} className="text-violet-600" /> : <Copy size={12} />}
                            </button>
                          </div>
                          <p className="text-slate-500 text-[9px] pt-0.5">
                            GPay &middot; PhonePe &middot; Paytm &middot; BHIM
                          </p>
                          {upiPayAmount > 0 && (
                            <p className="text-slate-900 font-semibold text-[10px] font-mono">
                              ₹{upiPayAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Calculations */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Tax ({taxRate}%):</span>
                      <span className="font-mono font-semibold text-slate-800">
                        ₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-y-2 border-slate-900 font-bold text-sm">
                      <span className="uppercase tracking-wider text-slate-900">Total:</span>
                      <span className="font-mono text-slate-900">
                        ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {paidVal > 0 && (
                      <div className="flex justify-between py-0.5 text-emerald-700 font-semibold">
                        <span>Amount Paid:</span>
                        <span className="font-mono">- ₹{paidVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 font-bold text-xs bg-slate-100 px-2 rounded">
                      <span className="text-slate-900 uppercase tracking-wider">Balance Due:</span>
                      <span className="font-mono text-slate-900">
                        ₹{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms Summary */}
                <div className="pt-3 text-[10px] text-slate-500 leading-relaxed space-y-0.5">
                  <h5 className="font-bold uppercase tracking-wider text-slate-800 text-[10px] mb-0.5">
                    Terms & Conditions
                  </h5>
                  <p><strong>1. Payments:</strong> Work begins upon deposit confirmation.</p>
                  <p><strong>2. Scope & IP:</strong> Custom deliverables ownership transfers upon final payment. Complete terms apply at <span className="underline text-slate-700">infronixweb.in/terms-and-conditions</span>.</p>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                  <div>InfronixWeb Digital Marketing &middot; Thank you for your business.</div>
                  <div>Page 1 of 1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        EMAIL INVOICE MODAL DIALOG
      */}
      {isEmailModalOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden animate-fadeIn overflow-y-auto"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div 
            className="bg-white border border-slate-200 w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
            data-lenis-prevent="true"
          >
            <div className="bg-white border-b border-slate-200 p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <PaperPlaneTilt className="text-violet-600 text-xl" weight="bold" />
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  Send Invoice via Hostinger
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div 
              className="p-6 space-y-4 text-xs text-slate-800 overflow-y-auto max-h-[calc(90vh-140px)]"
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
            >
              {emailStatusMessage.text && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                  emailStatusMessage.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {emailStatusMessage.type === 'success' ? <CheckCircle size={16} weight="bold" /> : <Info size={16} weight="bold" />}
                  <span>{emailStatusMessage.text}</span>
                </div>
              )}

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px] font-bold">Recipient (To):</span>
                  <span className="text-slate-900 font-bold text-sm">{client?.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px] font-bold">Subject:</span>
                  <span className="text-violet-700 font-semibold">Invoice {invoiceId} — InfronixWeb Digital Marketing</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-700 uppercase tracking-wider block mb-1 font-semibold">
                  Personalized Agency Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={emailNote}
                  onChange={(e) => setEmailNote(e.target.value)}
                  placeholder="e.g. Hi, thanks for getting in touch with InfronixWeb. Attached is the initial invoice for our sprint..."
                  className="w-full bg-white text-slate-900 p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 font-medium"
                />
              </div>

              {enableUpi && upiId && (
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-700 space-y-1">
                  <span className="text-[10px] text-violet-700 uppercase tracking-wider block font-bold">Included Payment Option</span>
                  <p>UPI VPA: <span className="font-mono text-slate-900 font-bold">{upiId}</span> ({upiPayeeName})</p>
                </div>
              )}

              <p className="text-[11px] text-slate-500 italic">
                The client will receive an email containing the itemized invoice table, bank details, and Terms & Conditions.
              </p>
            </div>

            <div className="p-4 md:p-5 border-t border-slate-200 bg-slate-50/50 flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                disabled={sendingEmail}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs uppercase tracking-wider font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvoiceEmail}
                disabled={sendingEmail}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <PaperPlaneTilt size={16} weight="bold" />
                <span>{sendingEmail ? 'Dispatching...' : 'Dispatch Invoice Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
