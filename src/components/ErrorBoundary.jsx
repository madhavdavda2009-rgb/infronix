"use client";
import { ArrowsClockwise, SmileySad, House } from "@phosphor-icons/react";
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error internally without exposing technical stack to non-technical users
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
        <div className="min-h-screen w-full bg-surface flex items-center justify-center p-margin-mobile">
          <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant p-8 md:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-navy-muted/10 text-navy-muted rounded-full flex items-center justify-center mx-auto">
              <SmileySad className="text-3xl" weight="bold" />
            </div>
            
            <div className="space-y-2">
              <span className="font-label-caps text-xs text-secondary tracking-widest uppercase block font-bold">
                Temporary Interruption
              </span>
              <h1 className="font-headline-md text-2xl md:text-3xl text-primary font-bold">
                Something Went Wrong
              </h1>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                We encountered an unexpected issue while displaying this page. Please try refreshing or return to our homepage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-navy-muted text-surface font-label-caps uppercase tracking-widest py-3 px-4 hover:bg-champagne-light hover:text-navy-muted transition-all border border-navy-muted flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <ArrowsClockwise className="text-lg" weight="bold" />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-transparent text-primary font-label-caps uppercase tracking-widest py-3 px-4 hover:bg-surface-container-low transition-all border border-outline-variant flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <House className="text-lg" weight="bold" />
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
