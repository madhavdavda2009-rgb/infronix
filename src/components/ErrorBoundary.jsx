"use client";
import { ArrowsClockwise, SmileySad, House } from "@phosphor-icons/react";
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Exception caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0B0D12] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
          {/* Subtle background glow matching website theme */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-md w-full bg-[#121620]/90 border border-primary/30 p-8 sm:p-10 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.15)] text-center space-y-6 backdrop-blur-md">
            <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto">
              <SmileySad className="text-3xl" weight="duotone" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[11px] text-primary font-mono tracking-widest uppercase block font-medium">
                System Notification
              </span>
              <h1 className="text-2xl sm:text-3xl text-white font-light font-heading tracking-tight">
                Something Went Wrong
              </h1>
              <p className="text-xs sm:text-sm text-[#A0AEC0] leading-relaxed font-light">
                We encountered an unexpected issue while displaying this page. Please try reloading or return to our homepage.
              </p>
              {this.state.error && process.env.NODE_ENV !== 'production' && (
                <div className="mt-4 p-3 bg-[#1A1F2C] border border-primary/30 text-left rounded-xl text-xs font-mono text-purple-200 overflow-x-auto">
                  <div className="font-normal text-primary">{this.state.error.name}: {this.state.error.message}</div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <ArrowsClockwise className="text-base" weight="bold" />
                <span>Reload Page</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-transparent text-[#CBD5E1] hover:text-white hover:bg-white/5 text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <House className="text-base" weight="bold" />
                <span>Home Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
