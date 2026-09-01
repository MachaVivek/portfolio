"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback" style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          color: "var(--white-2, #ffffff)",
        }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Something went wrong</h2>
          <p style={{ color: "var(--light-gray, #a0aec0)", maxWidth: "450px", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            An unexpected error occurred in the application. Please try reloading the page.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "10px",
              background: "var(--accent-color, #22D3EE)",
              color: "var(--accent-contrast-text, #0f172a)",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
