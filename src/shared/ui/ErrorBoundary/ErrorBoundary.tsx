import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep minimal logging; useful during development.

    console.error('Unhandled error in UI:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Что-то пошло не так</div>
            <div style={{ color: 'rgba(0,0,0,0.65)' }}>Обновите страницу или попробуйте позже.</div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
