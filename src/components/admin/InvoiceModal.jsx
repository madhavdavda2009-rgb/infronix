import React, { useState, useEffect } from 'react';
import { X, Printer, Plus, Trash } from '@phosphor-icons/react';

export default function InvoiceModal({ client, onClose }) {
  const [items, setItems] = useState([{ description: 'Website Development (50% Deposit)', amount: 15000 }]);
  const [taxRate, setTaxRate] = useState(18); // Default GST
  const [isPrinting, setIsPrinting] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [issueDate, setIssueDate] = useState('');

  useEffect(() => {
    // Generate an invoice ID based on date and client ID
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    setInvoiceId(`INV-${dateStr}-${client.id.toString().padStart(4, '0')}`);
    setIssueDate(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, [client]);

  const handleAddItem = () => {
    setItems([...items, { description: '', amount: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      // Wait a moment for print dialog to open before restoring UI
      setTimeout(() => setIsPrinting(false), 1000);
    }, 300);
  };

  // When printing, we only show the A4 printable area.
  if (isPrinting) {
    return (
      <div className="fixed inset-0 z-[99999] bg-white text-black overflow-y-auto">
        <div className="max-w-[21cm] mx-auto min-h-[29.7cm] p-12 font-sans">

          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-1">INFRONIX</h1>
              <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Web Agency</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-slate-200 uppercase tracking-widest mb-2">Invoice</h2>
              <p className="text-sm text-slate-600 font-semibold">{invoiceId}</p>
              <p className="text-sm text-slate-500">Issued: {issueDate}</p>
            </div>
          </div>

          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Billed To</h3>
              <p className="font-bold text-lg text-slate-900">{client.firstName} {client.lastName}</p>
              {client.company && <p className="text-slate-700 font-medium">{client.company}</p>}
              <p className="text-slate-600">{client.email}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">From</h3>
              <p className="font-bold text-slate-900">Infronix Web Agency</p>
              <p className="text-slate-600">madhavdavda2009@gmail.com</p>
              <p className="text-slate-600">Sanand, Ahmedabad, Gujarat, India</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-8 text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-900">
                <th className="py-3 text-xs uppercase font-bold tracking-widest w-3/4">Description</th>
                <th className="py-3 text-xs uppercase font-bold tracking-widest text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-slate-200">
                  <td className="py-4 text-slate-800 font-medium">{item.description || 'Service Description'}</td>
                  <td className="py-4 text-right text-slate-800 font-mono">₹{parseFloat(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-16">
            <div className="w-1/2">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Subtotal</span>
                <span className="font-mono text-slate-800 font-semibold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Tax ({taxRate}%)</span>
                <span className="font-mono text-slate-800 font-semibold">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-4 border-b-2 border-slate-800 mt-2">
                <span className="text-lg font-bold text-slate-900 uppercase tracking-widest">Total Due</span>
                <span className="text-xl font-bold font-mono text-slate-900">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions (Extracted from legal page) */}
          <div className="mt-auto pt-8 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 mb-4">Terms & Conditions</h4>
            <div className="text-[10px] leading-relaxed text-slate-500 space-y-2 font-medium">
              <p><strong>1. Payments & Deposits:</strong> As per Section 15 of our Terms, work strictly begins only after the required advance payment (deposit) is received. Deposits are non-refundable and reserve your spot in our development schedule.</p>
              <p><strong>2. Scope of Services:</strong> This invoice defines the exact scope of work. Any features, integrations, revisions, or requests outside this scope will require additional fees as per Section 3.</p>
              <p><strong>3. Client Responsibilities:</strong> The Client agrees to provide necessary approvals, content, and timely feedback. Delays on the Client's end may result in project delays without liability to the Agency (Section 4).</p>
              <p><strong>4. Intellectual Property:</strong> Ownership of custom deliverables transfers to the Client only upon full and final payment. The Agency retains ownership of general-purpose code, libraries, and frameworks (Section 16).</p>
              <p><strong>5. Governing Law:</strong> Payment of this invoice signifies complete agreement to the Infronix Web Agency Terms and Conditions available at infronixweb.in/terms-and-conditions.</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Interactive Admin Modal View
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
      <div className="bg-surface-container-lowest border border-champagne-light/40 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest/90 backdrop-blur border-b border-outline-variant/30 p-6 flex justify-between items-center z-10">
          <div>
            <span className="font-label-caps text-xs text-champagne-light uppercase tracking-widest font-bold">Generate Invoice</span>
            <h2 className="font-headline-md text-xl text-primary font-bold">Client: {client.firstName} {client.lastName}</h2>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-champagne-light text-navy-muted font-bold text-xs font-label-caps uppercase tracking-widest hover:bg-white transition-colors cursor-pointer flex items-center gap-2"
            >
              <Printer weight="bold" className="text-base" /> Print / PDF
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer p-2">
              <X className="text-2xl" weight="bold" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-grow">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Col: Editable Items */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-headline-md text-lg text-primary font-bold border-b border-outline-variant/30 pb-2 mb-4">Line Items</h3>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-grow">
                        <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full bg-slate-900 text-white p-3 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light font-medium"
                          placeholder="e.g. 50% Upfront Deposit for Web App"
                        />
                      </div>
                      <div className="w-32">
                        <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Amount (₹)</label>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                          className="w-full bg-slate-900 text-white p-3 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light font-medium"
                          min="0"
                        />
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-3 bg-red-950/40 text-red-400 hover:bg-red-900 border border-red-900 transition-colors"
                          title="Remove Item"
                        >
                          <Trash weight="fill" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddItem}
                  className="mt-4 flex items-center gap-2 text-xs font-label-caps uppercase tracking-widest text-champagne-light hover:text-white transition-colors border border-champagne-light/30 border-dashed w-full justify-center p-3"
                >
                  <Plus weight="bold" /> Add Line Item
                </button>
              </div>
            </div>

            {/* Right Col: Summary & Settings */}
            <div className="bg-slate-950 p-6 border border-outline-variant/30 h-fit">
              <h3 className="font-headline-md text-lg text-primary font-bold border-b border-outline-variant/30 pb-2 mb-4">Invoice Settings</h3>

              <div className="mb-6">
                <label className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 text-white p-3 text-sm border border-slate-700 focus:outline-none focus:border-champagne-light font-medium"
                  min="0"
                />
              </div>

              <div className="space-y-3 mb-6 font-mono text-sm border-t border-outline-variant/30 pt-4">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tax ({taxRate}%):</span>
                  <span>₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-champagne-light font-bold text-lg pt-2 border-t border-outline-variant/30">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="bg-slate-900 p-4 border border-slate-800">
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Clicking "Print / PDF" will generate a clean, white A4 invoice with the Infronix Terms and Conditions appended to the bottom. Background graphics will be hidden.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
