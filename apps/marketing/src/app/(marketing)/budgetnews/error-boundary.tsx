"use client";

import { Component } from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class BudgetNewsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("BudgetNews error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <p className="text-destructive">
              {this.state.error?.message || "Could not load budget news"}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
