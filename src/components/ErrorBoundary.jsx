// src/components/ErrorBoundary.jsx
// Error boundary to catch Stack Auth connection errors
import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

class StackAuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a Stack Auth connection error
    const isStackAuthError = 
      error?.message?.includes('Stack Auth') ||
      error?.message?.includes('Failed to fetch') ||
      error?.message?.includes('unable to connect');
    
    if (isStackAuthError) {
      return { hasError: true, error };
    }
    return { hasError: false, error: null };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Stack Auth Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 flex items-center justify-center p-4 sm:p-6">
          <Card className="bg-slate-900/90 border-red-500/50 max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertCircle className="h-5 w-5" />
                <CardTitle className="text-red-400">Stack Auth Connection Error</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Unable to connect to Stack Auth server. Please configure trusted domains.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-400 space-y-3">
                <div>
                  <p className="text-white font-semibold mb-2">Quick Fix:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to <a href="https://stack-auth.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Stack Auth Dashboard</a></li>
                    <li>Select your project: <code className="bg-slate-800 px-2 py-1 rounded text-xs">5a629032-2f33-46db-ac2c-134894a117eb</code></li>
                    <li>Navigate to <strong>Settings → Trusted Domains</strong></li>
                    <li>Add: <code className="bg-slate-800 px-2 py-1 rounded text-xs">localhost:3000</code></li>
                    <li>Click <strong>Save</strong></li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-white font-semibold mb-1">For Production:</p>
                  <p className="text-xs">Also add: <code className="bg-slate-800 px-2 py-1 rounded">www.byoncocare.com</code> and <code className="bg-slate-800 px-2 py-1 rounded">byoncocare.com</code></p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.reload();
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default StackAuthErrorBoundary;
