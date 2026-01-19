// src/components/SplineErrorBoundary.jsx
// Error boundary for Spline component with fallback UI

import React from 'react';

class SplineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error but don't crash the app
    console.warn('[Spline] failed to load, using fallback background:', error.message);
    // Don't log full errorInfo to console to avoid noise
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI: gradient background matching the page theme
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-950/60 via-purple-900/40 to-cyan-950/60 flex items-center justify-center rounded-xl border border-purple-600/40">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-purple-300 text-sm">3D visualization unavailable</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SplineErrorBoundary;
