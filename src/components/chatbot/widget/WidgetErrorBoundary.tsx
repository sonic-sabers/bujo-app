"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface WidgetErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface WidgetErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Production-grade error boundary for the chat widget.
 *
 * Features:
 * - Isolates widget errors from host application
 * - Reports errors via callback for analytics/monitoring
 * - Provides graceful degradation with retry capability
 * - Prevents widget crashes from affecting host page
 */
export class WidgetErrorBoundary extends Component<
  WidgetErrorBoundaryProps,
  WidgetErrorBoundaryState
> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): WidgetErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report to analytics/monitoring
    this.props.onError?.(error, errorInfo);

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.error("[BujoChat] Widget Error:", error);
      console.error("[BujoChat] Component Stack:", errorInfo.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 50,
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            maxWidth: "280px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            Chat temporarily unavailable
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              marginTop: "12px",
              padding: "8px 16px",
              backgroundColor: "#00b4d8",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WidgetErrorBoundary;
