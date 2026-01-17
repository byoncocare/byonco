// src/stack/client.js
// Stack Auth client configuration - Production Ready
import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";
import { stackConfig } from "@/config/stack";

// Debug: Log configuration before initialization
if (typeof window !== 'undefined') {
  console.log("[STACK AUTH] Initializing client with config:", {
    projectId: stackConfig.projectId ? stackConfig.projectId.substring(0, 6) + "..." : "MISSING",
    publishableKey: stackConfig.publishableClientKey ? stackConfig.publishableClientKey.substring(0, 6) + "..." : "MISSING",
    baseUrl: stackConfig.baseUrl,
    isValid: stackConfig.isValid,
  });
}

// Initialize Stack Auth client
export const stackClientApp = new StackClientApp({
  // Use centralized config module
  projectId: stackConfig.projectId,
  publishableClientKey: stackConfig.publishableClientKey,
  
  // Explicitly set API URL for production
  baseUrl: stackConfig.baseUrl,
  
  // Token storage - secure cookies for production
  tokenStore: "cookie",
  
  // Navigation method - React Router
  redirectMethod: {
    useNavigate,
  },
  
  // URL configuration - use canonical domain (www.byoncocare.com)
  // Stack Auth will use the current domain automatically
  urls: {
    signIn: "/authentication",
    signUp: "/authentication",
    afterSignIn: "/",
    afterSignUp: "/",
    // OAuth callback handler - use relative path (Stack Auth handles domain)
    handler: "/handler",
  },
});
