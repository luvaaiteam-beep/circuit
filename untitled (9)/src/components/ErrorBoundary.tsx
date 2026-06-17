import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Three.js renderer:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-950 text-zinc-300 p-6">
          <ShieldAlert className="text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Simulation Engine Error</h2>
          <p className="text-zinc-500 max-w-md text-center mb-6 text-sm">
            The 3D renderer encountered a critical error. The interface is still active, but the 3D scene has been disabled to prevent total failure.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded text-xs font-mono text-red-400 w-full max-w-lg mb-6 overflow-auto">
            {this.state.error?.message || 'Unknown render error.'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 rounded font-medium transition-all"
          >
            Attempt Restart Engine
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
