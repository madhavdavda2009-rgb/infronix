"use client";
import React, { Suspense } from 'react';
import SEO from '@/components/SEO';
import FounderOSShell from '@/components/founder-os/FounderOSShell';

export default function AdminDashboardPage() {
  return (
    <>
      <SEO
        title="InfronixWeb Founder OS | Internal Operating System"
        description="Executive agency management portal for InfronixWeb Digital Marketing."
      />
      <Suspense fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-3 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Loading Founder OS...</span>
          </div>
        </div>
      }>
        <FounderOSShell />
      </Suspense>
    </>
  );
}
