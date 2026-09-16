"use client";
import React from 'react';
import {
  CurrencyInr,
  Briefcase,
  Folder,
  FileText,
  TrendUp,
  TrendDown,
  Clock,
  Warning,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ChartLineUp,
  CreditCard
} from '@phosphor-icons/react';
import EmptyState from './EmptyState';

export default function DashboardModule({
  metrics = {},
  charts = {},
  alerts = [],
  recentActivity = [],
  settings = {},
  onNavigate,
  onQuickAction
}) {
  const currency = settings.currency_symbol || '₹';

  const totalRevenue = metrics.totalRevenue || 0;
  const totalExpenses = metrics.totalExpenses || 0;
  const netProfit = metrics.netProfit || 0;
  const activeProjects = metrics.activeProjects || 0;
  const openLeads = metrics.openLeads || 0;
  const pendingProposals = metrics.pendingProposals || 0;
  const outstandingPayments = metrics.outstandingPayments || 0;

  const monthlyData = charts.monthlyChartData || [];
  const leadStatusMap = charts.leadStatusMap || {};
  const projectStatusMap = charts.projectStatusMap || {};

  const hasFinancialData = monthlyData.length > 0;
  const hasLeads = Object.keys(leadStatusMap).length > 0;
  const hasProjects = Object.keys(projectStatusMap).length > 0;

  const maxMonthlyVal = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.expenses, Math.abs(d.profit))), 1000);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Founder Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 transition-all shadow-xs hover:shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
              <CurrencyInr size={18} weight="bold" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit tracking-tight">
            {currency}{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Real received revenue</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 transition-all shadow-xs hover:shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
              Total Expenses
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <CreditCard size={18} weight="bold" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit tracking-tight">
            {currency}{totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Agency operating costs</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-xs hover:shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
              Net Profit
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              netProfit >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
            }`}>
              {netProfit >= 0 ? <TrendUp size={18} weight="bold" /> : <TrendDown size={18} weight="bold" />}
            </div>
          </div>
          <div className={`text-2xl md:text-3xl font-bold font-outfit tracking-tight ${netProfit >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
            {currency}{netProfit.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
            <span>Revenue minus Expenses</span>
          </div>
        </div>

        {/* Outstanding Payments */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 transition-all shadow-xs hover:shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
              Outstanding Receivables
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Clock size={18} weight="bold" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900 font-outfit tracking-tight">
            {currency}{outstandingPayments.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Pending or overdue invoices</span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Active Projects */}
        <div
          onClick={() => onNavigate('/admin?tab=delivery')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-violet-400 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Active Projects
            </span>
            <div className="text-xl md:text-2xl font-bold text-slate-900 font-outfit">
              {activeProjects}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
            <Folder size={20} weight="bold" />
          </div>
        </div>

        {/* Open Leads */}
        <div
          onClick={() => onNavigate('/admin?tab=sales')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Open CRM Leads
            </span>
            <div className="text-xl md:text-2xl font-bold text-slate-900 font-outfit">
              {openLeads}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Briefcase size={20} weight="bold" />
          </div>
        </div>

        {/* Pending Proposals */}
        <div
          onClick={() => onNavigate('/admin?tab=sales&sub=proposals')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Pending Proposals
            </span>
            <div className="text-xl md:text-2xl font-bold text-slate-900 font-outfit">
              {pendingProposals}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <FileText size={20} weight="bold" />
          </div>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Financial Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                Financial Performance (Monthly)
              </h3>
              <p className="text-xs text-slate-500">Revenue, expenses & net profit</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                <span className="text-slate-600">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600">Expenses</span>
              </div>
            </div>
          </div>

          {!hasFinancialData ? (
            <EmptyState
              icon={ChartLineUp}
              title="No financial records yet"
              description="Add your first revenue receipt or expense to generate the monthly financial performance chart."
              actionLabel="Record Revenue"
              onAction={() => onQuickAction('add_revenue')}
              secondaryActionLabel="Add Expense"
              onSecondaryAction={() => onQuickAction('add_expense')}
            />
          ) : (
            <div className="h-64 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100 overflow-x-auto">
              {monthlyData.map((d, i) => {
                const revHeight = Math.round((d.revenue / maxMonthlyVal) * 100);
                const expHeight = Math.round((d.expenses / maxMonthlyVal) * 100);

                return (
                  <div key={i} className="flex-1 min-w-[50px] flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${Math.max(revHeight, 4)}%` }}
                        className="w-3.5 rounded-t-md bg-violet-600 transition-all group-hover:brightness-110 relative shadow-xs"
                        title={`Revenue: ₹${d.revenue.toLocaleString('en-IN')}`}
                      />
                      {/* Expense Bar */}
                      <div
                        style={{ height: `${Math.max(expHeight, 4)}%` }}
                        className="w-3.5 rounded-t-md bg-rose-500 transition-all group-hover:brightness-110 relative shadow-xs"
                        title={`Expense: ₹${d.expenses.toLocaleString('en-IN')}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono font-bold truncate">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pipeline & Delivery Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit mb-1">
              Sales Pipeline Health
            </h3>
            <p className="text-xs text-slate-500 mb-4">Leads by stage</p>

            {!hasLeads ? (
              <EmptyState
                icon={Briefcase}
                title="Pipeline is empty"
                description="Add leads to track conversion through your sales funnel."
                actionLabel="Add Lead"
                onAction={() => onQuickAction('new_lead')}
              />
            ) : (
              <div className="space-y-2">
                {Object.entries(leadStatusMap).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-slate-700 font-semibold">{status}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold shadow-2xs">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/admin?tab=sales')}
            className="mt-4 text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline flex items-center justify-center gap-1 py-1"
          >
            <span>Open Sales CRM</span>
            <ArrowRight size={13} weight="bold" />
          </button>
        </div>
      </div>

      {/* 3. Bottom Row: Action Items / Alerts & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Items / Alerts */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Warning size={18} className="text-amber-500" weight="bold" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
                Action Items ({alerts.length})
              </h3>
            </div>
          </div>

          {alerts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle size={24} className="text-emerald-500 mx-auto mb-2 opacity-90" weight="duotone" />
              <span>No overdue items or approaching deadlines!</span>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  onClick={() => a.link && onNavigate(a.link)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 mb-0.5">
                      {a.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {a.description}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shrink-0 shadow-2xs">
                    {a.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Log / Recent Activity Stream */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
              Live Audit Stream
            </h3>
            <button
              onClick={() => onNavigate('/admin?tab=activity')}
              className="text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline"
            >
              View Full Log
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              <span>No activity logged yet. Real events will record here automatically.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivity.slice(0, 5).map((act) => (
                <div key={act.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-800 block truncate">
                      {act.details}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      By {act.user_name} • {act.action}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
