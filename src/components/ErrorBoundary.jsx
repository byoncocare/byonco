// src/components/ErrorBoundary.jsx
// Error boundary to catch Stack Auth connection errors
import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { debugStackConfig } from '@/config/stack';

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
      // Get debug info to show what's missing
      const debugInfo = typeof window !== 'undefined' ? debugStackConfig() : null;
      const isMissingEnvVars = debugInfo && (!debugInfo.projectIdPresent || !debugInfo.publishableKeyPresent);
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-indigo-950 flex items-center justify-center p-4 sm:p-6">
          <Card className="bg-slate-900/90 border-red-500/50 max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertCircle className="h-5 w-5" />
                <CardTitle className="text-red-400">Stack Auth Connection Error</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Unable to connect to Stack Auth server. Please verify production configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isMissingEnvVars && (
                <div className="bg-red-900/20 border border-red-500/50 rounded p-3 mb-4">
                  <p className="text-red-400 font-semibold text-sm mb-1">⚠️ Missing Environment Variables</p>
                  <p className="text-xs text-gray-300">
                    {!debugInfo.projectIdPresent && "• REACT_APP_STACK_PROJECT_ID is missing\n"}
                    {!debugInfo.publishableKeyPresent && "• REACT_APP_STACK_PUBLISHABLE_KEY is missing\n"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Add these in Vercel Dashboard → Settings → Environment Variables → Production
                  </p>
                </div>
              )}
              
              <div className="text-sm text-gray-400 space-y-3">
                <div>
                  <p className="text-white font-semibold mb-2">Production Configuration:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>Go to <a href="https://app.stack-auth.com/projects/5a629032-2f33-46db-ac2c-134894a117eb/domains" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Stack Auth Dashboard → Trusted Domains</a></li>
                    <li>Verify these domains are added (with <code className="bg-slate-800 px-1 py-0.5 rounded text-xs">https://</code> prefix):
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li><code className="bg-slate-800 px-1 py-0.5 rounded text-xs">https://www.byoncocare.com</code></li>
                        <li><code className="bg-slate-800 px-1 py-0.5 rounded text-xs">https://byoncocare.com</code></li>
                      </ul>
                    </li>
                    <li>Check Vercel Environment Variables:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li><code className="bg-slate-800 px-1 py-0.5 rounded text-xs">REACT_APP_STACK_PROJECT_ID</code></li>
                        <li><code className="bg-slate-800 px-1 py-0.5 rounded text-xs">REACT_APP_STACK_PUBLISHABLE_KEY</code></li>
                      </ul>
                    </li>
                    <li>After updating, redeploy on Vercel (with "Clear build cache")</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
                
                {debugInfo && (
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-white font-semibold mb-1">Debug Info:</p>
                    <div className="text-xs space-y-1">
                      <p>Domain: <code className="bg-slate-800 px-1 py-0.5 rounded">{debugInfo.hostname}</code></p>
                      <p>Project ID: {debugInfo.projectIdPresent ? "✅ Present" : "❌ Missing"}</p>
                      <p>Publishable Key: {debugInfo.publishableKeyPresent ? "✅ Present" : "❌ Missing"}</p>
                      <p>API URL: <code className="bg-slate-800 px-1 py-0.5 rounded">{debugInfo.apiUrl}</code></p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    // Clear error state and retry without full page reload
                    this.setState({ hasError: false, error: null });
                    // Trigger a re-render by forcing component remount
                    window.dispatchEvent(new Event('stackauth-retry'));
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
