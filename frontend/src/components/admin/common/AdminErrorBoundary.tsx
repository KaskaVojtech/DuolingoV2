'use client';
import { Component, ErrorInfo, ReactNode } from 'react';
import { AdminErrorFallback } from './AdminErrorFallback';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AdminErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <AdminErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    return this.props.children;
  }
}
