'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEnquiryContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing. Please check your email link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/enquiries/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        
        const data = await res.json();
        
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Failed to verify email. The link may have expired.');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#121620]/90 rounded-2xl border border-primary/30 p-8 sm:p-10 shadow-[0_0_40px_rgba(139,92,246,0.15)] text-center backdrop-blur-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="InfronixWeb Home">
            <img
              src="/dark-web-logo.webp"
              alt="InfronixWeb"
              width={160}
              height={40}
              style={{ width: 'auto', height: 'auto' }}
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {status === 'loading' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-light text-white font-heading tracking-tight">Verifying Email</h1>
            <p className="text-slate-400 font-light text-sm">Please wait while we verify your secure link...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center text-accent">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-light text-white font-heading tracking-tight">Email Verified!</h1>
            <p className="text-slate-300 font-light text-sm leading-relaxed">
              Thank you for verifying your email address. Your enquiry has now been successfully submitted to our team.
            </p>
            <div className="pt-4">
              <Link href="/" className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-normal rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.25)] text-sm uppercase tracking-wider">
                Return to Website
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center text-primary">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-light text-white font-heading tracking-tight">Verification Notice</h1>
            <p className="text-slate-200 text-xs sm:text-sm bg-primary/10 border border-primary/30 p-4 rounded-xl font-light leading-relaxed">
              {errorMessage}
            </p>
            <p className="text-slate-400 text-xs font-light">
              If your link has expired, you can request a new one by submitting the form again, or contact us directly at <a href="mailto:support@infronixweb.in" className="text-primary hover:underline">support@infronixweb.in</a>.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="inline-flex items-center justify-center w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-normal rounded-xl transition-colors border border-white/10 text-sm">
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEnquiryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center p-4">
        <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEnquiryContent />
    </Suspense>
  );
}
