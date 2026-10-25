import React, { Component } from 'react';
import { GlassCard } from './GlassCard';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if ((this as any).state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <GlassCard className="max-w-md p-8 text-center border-red-500/30">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Oops!</h2>
            <p className="text-gray-300 mb-8">Something went wrong.</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <RefreshCcw size={18} /> Reload Application
            </button>
          </GlassCard>
        </div>
      );
    }
    return (this as any).props.children;
  }
}
