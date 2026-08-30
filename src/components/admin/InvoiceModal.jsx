"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Plus, 
  Trash, 
  PaperPlaneTilt, 
  Sparkle, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Receipt, 
  Copy, 
  FileText,
  Building,
  User,
  Envelope,
  Phone,
  Globe,
  Info
} from '@phosphor-icons/react';

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

  // Email modal & loading state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailNote, setEmailNote] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState({ type: '', text: '' });
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    // Generate standard Infronix invoice ID
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const clientNum = (client?.id || Math.floor(Math.random() * 9000 + 1000)).toString().padStart(4, '0');
    setInvoiceId(`INV-${dateStr}-${clientNum}`);

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

  // Trigger Print
  const handlePrint = () => {
    window.print();
  };

  // Copy Summary text for WhatsApp/Message
  const handleCopySummary = () => {
    const summary = `*INFRONIX WEB AGENCY — INVOICE ${invoiceId}*
Client: ${client?.firstName} ${client?.lastName}
Total Amount: ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Amount Paid: ₹${paidVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Balance Due: ₹${balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Status: ${derivedStatus}
Due Date: ${dueDate}
Online Invoice & Terms: https://www.infronixweb.in/terms-and-conditions`;

    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
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
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'PENDING':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300';
    }
  };

  return (
    <>
      {/* 
        PRINT CONTAINER (Visible ONLY when printing A4)
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
              <div className="w-14 h-14 bg-[#1C2541] flex items-center justify-center p-2 rounded shrink-0">
                <img 
                  src="/web-log-removebg-preview.png" 
                  alt="Infronix" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
                  INFRONIX WEB AGENCY
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
              <h2 className="text-2xl font-bold uppercase tracking-widest text-[#1C2541] font-serif">
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
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">
                Billed To
              </span>
              <p className="font-bold text-sm text-slate-900">{client?.firstName} {client?.lastName}</p>
              {client?.company && <p className="font-medium text-slate-700 mt-0.5">{client.company}</p>}
              <p className="text-slate-600 mt-0.5">{client?.email}</p>
              {client?.phone && <p className="text-slate-600">{client.phone}</p>}
            </div>

            {/* Issued By */}
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">
                Issued By
              </span>
              <p className="font-bold text-sm text-slate-900">Infronix Web Agency</p>
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
                <tr className="bg-[#1C2541] text-white text-[11px] uppercase tracking-wider font-bold">
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
            {/* Payment Details */}
            <div className="text-xs space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-400 block text-[10px]">
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
          <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
            <div>Infronix Web Agency &middot; Thank you for your business.</div>
            <div>Page 1 of 1</div>
          </div>

        </div>
      </div>

      {/* 
        INTERACTIVE ADMIN MODAL STUDIO (Screen view)
      */}
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 md:p-6 print:hidden animate-fadeIn">
        <div className="bg-slate-950 border border-champagne-light/40 w-full max-w-7xl h-[94vh] shadow-2xl flex flex-col overflow-hidden">
          
          {/* Top Bar Header */}
          <div className="bg-navy-muted/95 border-b border-champagne-light/20 px-6 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 border border-champagne-light/30 rounded flex items-center justify-center p-1">
                <Receipt className="text-champagne-light text-xl" weight="bold" />
              </div>
              <div>
                <span className="font-label-caps text-xs text-champagne-light uppercase tracking-widest block font-bold">
                  Professional Invoice Studio
                </span>
                <h2 className="font-headline-lg text-lg text-white font-bold">
                  {client?.firstName} {client?.lastName} {client?.company ? `(${client.company})` : ''}
                </h2>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-label-caps uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer"
                title="Copy Invoice text summary for WhatsApp or message"
              >
                <Copy size={15} />
                <span>{copiedNotification ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-champagne-light/50 hover:border-champagne-light text-champagne-light text-xs font-label-caps uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <PaperPlaneTilt size={15} weight="bold" />
                <span>Email Invoice</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 bg-champagne-light hover:bg-white text-navy-muted font-bold text-xs font-label-caps uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Printer size={16} weight="bold" />
                <span>Print / PDF</span>
              </button>

              <button 
                type="button"
                onClick={onClose} 
                className="text-slate-400 hover:text-white p-2 transition-colors cursor-pointer ml-1"
                title="Close"
              >
                <X size={22} weight="bold" />
              </button>
            </div>
          </div>

          {/* Main Dual-Pane Studio Body */}
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            
            {/* LEFT PANE: Invoice Configurator (5 cols) */}
            <div className="lg:col-span-5 border-r border-slate-800/80 p-5 overflow-y-auto space-y-5 bg-slate-950 text-xs font-body-md text-slate-200">
              
              {/* Metadata row */}
              <div className="bg-slate-900/80 p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-label-caps text-xs text-champagne-light uppercase tracking-wider font-bold">
                    Invoice Metadata
                  </h4>
                  <span className="font-mono text-[11px] text-slate-400">{invoiceId}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Issue Date
                    </label>
                    <input
                      type="text"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full bg-slate-950 text-white p-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Due Date
                    </label>
                    <input
                      type="text"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-slate-950 text-white p-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Payment Status
                    </label>
                    <select
                      value={manualStatus}
                      onChange={(e) => setManualStatus(e.target.value)}
                      className="w-full bg-slate-950 text-white p-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light font-bold"
                    >
                      <option value="AUTO">Auto ({derivedStatus})</option>
                      <option value="PENDING">PENDING</option>
                      <option value="PARTIALLY PAID">PARTIALLY PAID</option>
                      <option value="PAID">PAID</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      GST / Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 text-white p-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Editor */}
              <div className="bg-slate-900/80 p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-label-caps text-xs text-champagne-light uppercase tracking-wider font-bold">
                    Line Items ({items.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-champagne-light hover:text-white font-label-caps uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} weight="bold" /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Deliverable description..."
                          className="w-full bg-slate-900 text-white p-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light font-medium"
                        />
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/50 cursor-pointer shrink-0"
                            title="Delete line item"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-400 block mb-0.5">Qty</label>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                            className="w-full bg-slate-900 text-white p-1.5 border border-slate-700 text-center"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-0.5">Rate (₹)</label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                            className="w-full bg-slate-900 text-white p-1.5 border border-slate-700 text-right"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-0.5">Amount (₹)</label>
                          <div className="w-full bg-slate-900/60 p-1.5 border border-slate-800 text-right font-mono font-bold text-champagne-light">
                            ₹{parseFloat(item.amount || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments & Deposits */}
              <div className="bg-slate-900/80 p-4 border border-slate-800 space-y-3">
                <h4 className="font-label-caps text-xs text-champagne-light uppercase tracking-wider font-bold border-b border-slate-800 pb-2">
                  Payment Collection & Reconciliation
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Amount Paid (₹)
                    </label>
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 text-emerald-300 font-mono font-bold p-2 text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Payment Method
                    </label>
                    <input
                      type="text"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      placeholder="UPI / NEFT / IMPS"
                      className="w-full bg-slate-950 text-white p-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Transaction / Ref ID
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="TXN-XXXX"
                      className="w-full bg-slate-950 text-white p-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Payment Date
                    </label>
                    <input
                      type="text"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      placeholder="e.g. 30 Aug 2026"
                      className="w-full bg-slate-950 text-white p-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Invoice Notes
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light font-medium"
                  />
                </div>
              </div>

            </div>

            {/* RIGHT PANE: Live A4 Document Preview (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/50 p-4 md:p-8 overflow-y-auto flex items-start justify-center">
              
              {/* Paper simulation */}
              <div className="w-full max-w-[760px] bg-white text-slate-900 p-8 md:p-10 shadow-2xl rounded-sm border border-slate-300 font-sans">
                
                {/* Paper Header */}
                <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900 gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 bg-[#1C2541] rounded flex items-center justify-center p-2 shrink-0 shadow-sm">
                      <img 
                        src="/web-log-removebg-preview.png" 
                        alt="Infronix Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-950 font-serif tracking-tight leading-none">
                        INFRONIX WEB AGENCY
                      </h3>
                      <p className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
                        Web Development &middot; SEO &middot; AI Automation
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        www.infronixweb.in &middot; support@infronixweb.in
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <h4 className="text-xl font-bold uppercase tracking-widest text-[#1C2541] font-serif">
                      INVOICE
                    </h4>
                    <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{invoiceId}</p>
                    <div className="mt-1.5">
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${getStatusBadge(derivedStatus)}`}>
                        {derivedStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bill To & From Grid */}
                <div className="grid grid-cols-3 gap-4 py-5 border-b border-slate-200 text-xs">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">
                      Billed To
                    </span>
                    <p className="font-bold text-slate-900">{client?.firstName} {client?.lastName}</p>
                    {client?.company && <p className="font-medium text-slate-700 mt-0.5">{client.company}</p>}
                    <p className="text-slate-600 mt-0.5">{client?.email}</p>
                    {client?.phone && <p className="text-slate-600">{client.phone}</p>}
                  </div>

                  <div>
                    <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">
                      Issued By
                    </span>
                    <p className="font-bold text-slate-900">Infronix Web Agency</p>
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
                <div className="py-5">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#1C2541] text-white text-[10px] uppercase tracking-wider font-bold">
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3 text-center w-14">Qty</th>
                        <th className="py-2.5 px-3 text-right w-24">Rate (₹)</th>
                        <th className="py-2.5 px-3 text-right w-28">Amount (₹)</th>
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
                <div className="grid grid-cols-2 gap-6 pt-2 pb-5 border-b border-slate-200 text-xs">
                  {/* Left: Payment instruction */}
                  <div className="space-y-1.5">
                    <span className="font-bold uppercase tracking-wider text-slate-400 block text-[10px]">
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
                <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                  <div>Infronix Web Agency &middot; Thank you for your business.</div>
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
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 print:hidden animate-fadeIn">
          <div className="bg-slate-950 border border-champagne-light/50 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-navy-muted/90 border-b border-champagne-light/20 p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PaperPlaneTilt className="text-champagne-light text-xl" weight="bold" />
                <h3 className="font-headline-lg text-lg text-white font-bold">
                  Send Invoice via Hostinger
                </h3>
              </div>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-200">
              {emailStatusMessage.text && (
                <div className={`p-3 border text-xs flex items-center gap-2 font-medium ${
                  emailStatusMessage.type === 'success' 
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' 
                    : 'bg-red-950/60 border-red-500/50 text-red-200'
                }`}>
                  {emailStatusMessage.type === 'success' ? <CheckCircle size={16} weight="bold" /> : <Info size={16} weight="bold" />}
                  <span>{emailStatusMessage.text}</span>
                </div>
              )}

              <div className="bg-slate-900 p-3.5 border border-slate-800 space-y-1.5">
                <div>
                  <span className="text-slate-400 font-label-caps uppercase tracking-wider block text-[10px]">Recipient (To):</span>
                  <span className="text-white font-bold text-sm">{client?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-label-caps uppercase tracking-wider block text-[10px]">Subject:</span>
                  <span className="text-champagne-light font-medium">Invoice {invoiceId} — Infronix Web Agency</span>
                </div>
              </div>

              <div>
                <label className="font-label-caps text-xs text-slate-300 uppercase tracking-wider block mb-1 font-semibold">
                  Personalized Agency Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={emailNote}
                  onChange={(e) => setEmailNote(e.target.value)}
                  placeholder="e.g. Hi Madhav, thanks for getting in touch with Infronix. Attached is the initial invoice for our sprint..."
                  className="w-full bg-slate-900 text-white p-3 text-xs border border-slate-700 focus:outline-none focus:border-champagne-light font-medium"
                />
              </div>

              <p className="text-[11px] text-slate-400 italic">
                The client will receive an email containing the itemized invoice table, bank details, and Terms & Conditions.
              </p>
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-900/40 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                disabled={sendingEmail}
                className="px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs uppercase font-label-caps tracking-widest transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvoiceEmail}
                disabled={sendingEmail}
                className="px-5 py-2.5 bg-champagne-light hover:bg-white text-navy-muted text-xs uppercase font-label-caps tracking-widest font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
