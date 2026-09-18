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
    <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#11141d] rounded-2xl border border-white/10 p-8 shadow-2xl text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <img src="/dark-web-logo.png" alt="InfronixWeb" className="h-10" />
          </Link>
        </div>

        {status === 'loading' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-white">Verifying Email</h1>
            <p className="text-[#94a3b8]">Please wait while we verify your secure link...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Email Verified!</h1>
            <p className="text-[#94a3b8]">
              Thank you for verifying your email address. Your enquiry has now been successfully submitted to our team.
            </p>
            <div className="pt-4">
              <Link href="/" className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-lg transition-colors">
                Return to Website
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Verification Failed</h1>
            <p className="text-red-400 text-sm bg-red-500/10 p-4 rounded-lg">
              {errorMessage}
            </p>
            <p className="text-[#94a3b8] text-sm">
              If your link has expired, you can request a new one by submitting the form again, or contact us directly at <a href="mailto:support@infronixweb.in" className="text-[#3b82f6] hover:underline">support@infronixweb.in</a>.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="inline-flex items-center justify-center w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10">
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
      <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEnquiryContent />
    </Suspense>
  );
}
