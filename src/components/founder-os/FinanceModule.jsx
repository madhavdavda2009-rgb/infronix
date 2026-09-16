"use client";
import React, { useState, useEffect } from 'react';
import {
  CurrencyInr,
  Plus,
  MagnifyingGlass,
  Funnel,
  Pencil,
  Trash,
  X,
  CreditCard,
  Receipt,
  TrendUp,
  TrendDown,
  Clock,
  CheckCircle,
  Calendar,
  ArrowsClockwise
} from '@phosphor-icons/react';
import EmptyState from './EmptyState';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';

const REVENUE_STATUSES = ['Paid', 'Pending', 'Overdue', 'Cancelled'];

const PAYMENT_METHODS = [
  'Bank Transfer',
  'UPI',
  'Stripe',
  'Razorpay',
  'Cash',
  'Cheque',
  'Other'
];

const EXPENSE_CATEGORIES = [
  'Software',
  'Hosting',
  'Domain',
  'Marketing',
  'Salaries',
  'Freelancers',
  'Office',
  'Equipment',
  'Other'
];

export default function FinanceModule({ initialSub = 'overview', settings = {}, onRefreshDashboard }) {
  const [subTab, setSubTab] = useState(initialSub); // 'overview' | 'revenue' | 'expenses'
  const [financeData, setFinanceData] = useState({
    summary: {},
    revenue: [],
    expenses: [],
    monthlyBreakdown: [],
    projectProfitability: []
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Filter
  const [searchTerm, setSearchTerm] = useState('');

  const { showToast } = useToast();
  const currency = settings.currency_symbol || '₹';

  useEffect(() => {
    fetchFinance();
  }, []);

  async function fetchFinance() {
    setLoading(true);
    try {
      const res = await fetch('/api/founder-os/finance');
      const data = await res.json();
      if (data.success) {
        setFinanceData(data);
      }
    } catch (err) {
      showToast('Error loading financial records', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Handle Save Revenue
  async function handleSaveRevenue(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      type: 'revenue',
      client_name: form.client_name.value,
      project_name: form.project_name.value,
      amount: form.amount.value,
      payment_date: form.payment_date.value,
      payment_status: form.payment_status.value,
      payment_method: form.payment_method.value,
      invoice_number: form.invoice_number.value,
      notes: form.notes.value
    };

    try {
      const res = await fetch('/api/founder-os/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Revenue recorded successfully', 'success');
        setShowRevenueModal(false);
        fetchFinance();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to record revenue', 'error');
      }
    } catch (err) {
      showToast('Error recording revenue', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Save Expense
  async function handleSaveExpense(e) {
    e.preventDefault();
    setActionLoading(true);
    const form = e.target;
    const payload = {
      type: 'expense',
      category: form.category.value,
      description: form.description.value,
      amount: form.amount.value,
      expense_date: form.expense_date.value,
      payment_method: form.payment_method.value,
      is_recurring: form.is_recurring.checked,
      recurring_frequency: form.recurring_frequency?.value || null,
      notes: form.notes.value
    };

    try {
      const res = await fetch('/api/founder-os/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Expense recorded successfully', 'success');
        setShowExpenseModal(false);
        fetchFinance();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to record expense', 'error');
      }
    } catch (err) {
      showToast('Error recording expense', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // Handle Delete
  async function handleDeleteConfirm() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/founder-os/finance?type=${deleteConfirm.type}&id=${deleteConfirm.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('Record deleted', 'success');
        setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
        fetchFinance();
        if (onRefreshDashboard) onRefreshDashboard();
      } else {
        showToast(data.error || 'Failed to delete record', 'error');
      }
    } catch (err) {
      showToast('Error deleting record', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  const summary = financeData.summary || {};
  const paidRevenue = summary.paidRevenue || 0;
  const totalExpenses = summary.totalExpenses || 0;
  const netProfit = summary.netProfit || 0;
  const pendingRevenue = summary.pendingRevenue || 0;

  const filteredRevenue = (financeData.revenue || []).filter(r => 
    r.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = (financeData.expenses || []).filter(e =>
    e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Subtabs & Header Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSubTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'overview' 
                ? 'bg-white text-violet-700 shadow-xs border border-slate-200/80' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Profitability
          </button>
          <button
            type="button"
            onClick={() => setSubTab('revenue')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'revenue' 
                ? 'bg-white text-violet-700 shadow-xs border border-slate-200/80' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revenue & Invoices ({financeData.revenue?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('expenses')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'expenses' 
                ? 'bg-white text-violet-700 shadow-xs border border-slate-200/80' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expenses ({financeData.expenses?.length || 0})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRevenueModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={15} weight="bold" />
            <span>Record Revenue</span>
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={15} weight="bold" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW & PROFITABILITY TAB */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Realized Revenue (Paid)
              </span>
              <div className="text-2xl font-bold text-slate-900 font-outfit">
                {currency}{paidRevenue.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Total Expenses
              </span>
              <div className="text-2xl font-bold text-slate-900 font-outfit">
                {currency}{totalExpenses.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Net Profit
              </span>
              <div className={`text-2xl font-bold font-outfit ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {currency}{netProfit.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Pending Receivables
              </span>
              <div className="text-2xl font-bold text-amber-600 font-outfit">
                {currency}{pendingRevenue.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
              Monthly Financial Breakdown
            </h3>

            {(!financeData.monthlyBreakdown || financeData.monthlyBreakdown.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200/60">
                No financial history recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[550px] text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold bg-slate-50/50">
                    <tr>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Revenue</th>
                      <th className="py-2.5 px-3">Expenses</th>
                      <th className="py-2.5 px-3">Net Profit</th>
                      <th className="py-2.5 px-3">Profit Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {financeData.monthlyBreakdown.map((m) => {
                      const margin = m.revenue > 0 ? Math.round(((m.revenue - m.expenses) / m.revenue) * 100) : 0;
                      return (
                        <tr key={m.month} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-900">{m.month}</td>
                          <td className="py-3 px-3 text-emerald-600 font-bold">{currency}{m.revenue.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-3 text-rose-600 font-bold">{currency}{m.expenses.toLocaleString('en-IN')}</td>
                          <td className={`py-3 px-3 font-bold ${m.profit >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                            {currency}{m.profit.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-sans font-medium">{margin}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Project Profitability Table */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
              Project Profitability
            </h3>

            {(!financeData.projectProfitability || financeData.projectProfitability.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200/60">
                No project-attributed revenue or expenses recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[550px] text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-500 text-[11px] uppercase font-bold bg-slate-50/50">
                    <tr>
                      <th className="py-2.5 px-3">Project</th>
                      <th className="py-2.5 px-3">Client</th>
                      <th className="py-2.5 px-3">Revenue</th>
                      <th className="py-2.5 px-3">Direct Costs</th>
                      <th className="py-2.5 px-3">Profit</th>
                      <th className="py-2.5 px-3">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {financeData.projectProfitability.map((p) => (
                      <tr key={p.projectId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">{p.projectName}</td>
                        <td className="py-3 px-3 text-slate-600">{p.clientName}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-600">{currency}{p.revenue.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 font-mono font-bold text-rose-600">{currency}{p.expenses.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{currency}{p.profit.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 font-bold text-slate-700">{p.marginPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. REVENUE TAB */}
      {subTab === 'revenue' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by client or invoice number..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {filteredRevenue.length === 0 && !loading ? (
            <EmptyState
              icon={Receipt}
              title="No revenue records yet"
              description="Record payments, client invoices, and deposits."
              actionLabel="Record Revenue"
              onAction={() => setShowRevenueModal(true)}
            />
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Invoice #</th>
                      <th className="px-4 py-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRevenue.map((rev) => (
                      <tr key={rev.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {rev.client_name}
                          {rev.project_name && <span className="block text-[10px] text-slate-500 font-normal">{rev.project_name}</span>}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">
                          {currency}{parseFloat(rev.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(rev.payment_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            rev.payment_status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : rev.payment_status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {rev.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {rev.payment_method}
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono">
                          {rev.invoice_number || '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, type: 'revenue', id: rev.id, title: `Revenue from ${rev.client_name}` })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. EXPENSES TAB */}
      {subTab === 'expenses' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search expenses by category or description..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {filteredExpenses.length === 0 && !loading ? (
            <EmptyState
              icon={CreditCard}
              title="No expenses recorded"
              description="Track software subscriptions, hosting fees, salaries, and freelancer payments."
              actionLabel="Add Expense"
              onAction={() => setShowExpenseModal(true)}
            />
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {exp.description}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-rose-600">
                          {currency}{parseFloat(exp.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(exp.expense_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {exp.payment_method}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {exp.is_recurring ? (
                            <span className="text-violet-700 font-semibold">Recurring ({exp.recurring_frequency || 'Monthly'})</span>
                          ) : 'One-time'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, type: 'expense', id: exp.id, title: exp.description })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MODAL 1: RECORD REVENUE --- */}
      {showRevenueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Record Revenue / Payment Receipt
              </h3>
              <button 
                onClick={() => setShowRevenueModal(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRevenue} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Client Name *</label>
                <input
                  name="client_name"
                  required
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Name (Optional)</label>
                <input
                  name="project_name"
                  placeholder="e.g. Website Redesign Project"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount ({currency}) *</label>
                  <input
                    name="amount"
                    type="number"
                    required
                    step="100"
                    placeholder="50000"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Date *</label>
                  <input
                    name="payment_date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().substring(0, 10)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Status</label>
                  <select
                    name="payment_status"
                    defaultValue="Paid"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    {REVENUE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                  <select
                    name="payment_method"
                    defaultValue="Bank Transfer"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Invoice / Reference Number</label>
                <input
                  name="invoice_number"
                  placeholder="e.g. INV-2026-001"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Milestone 1 payment..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRevenueModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Recording...' : 'Record Revenue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD EXPENSE --- */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Add Agency Expense
              </h3>
              <button 
                onClick={() => setShowExpenseModal(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue="Software"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount ({currency}) *</label>
                  <input
                    name="amount"
                    type="number"
                    required
                    step="50"
                    placeholder="4500"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description *</label>
                <input
                  name="description"
                  required
                  placeholder="e.g. Vercel Pro & Domain renewal"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expense Date *</label>
                  <input
                    name="expense_date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().substring(0, 10)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                  <select
                    name="payment_method"
                    defaultValue="UPI"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                  >
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_recurring"
                  name="is_recurring"
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="is_recurring" className="text-slate-700 font-semibold">
                  Recurring monthly subscription
                </label>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Invoice link or billing details..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        isDestructive={true}
        title={`Delete ${deleteConfirm.type}`}
        message={`Are you sure you want to delete "${deleteConfirm.title}"?`}
        confirmLabel="Delete"
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
      />
    </div>
  );
}
