// src/stack/client.js
// Stack Auth client configuration - Production Ready
import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // Production keys - MUST be set via environment variables in Vercel
  // These are required for production deployment
  projectId: process.env.REACT_APP_STACK_PROJECT_ID || "5a629032-2f33-46db-ac2c-134894a117eb",
  publishableClientKey: process.env.REACT_APP_STACK_PUBLISHABLE_KEY || "pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg",
  
  // Token storage - secure cookies for production
  tokenStore: "cookie",
  
  // Navigation method - React Router
  redirectMethod: {
    useNavigate,
  },
  
  // URL configuration - relative paths work in production
  // Stack Auth will use the current domain automatically
  urls: {
    signIn: "/authentication",
    signUp: "/authentication",
    afterSignIn: "/",
    afterSignUp: "/",
  },
  
  // Explicitly set API URL for production (optional, defaults to api.stack-auth.com)
  // Only needed if using custom Stack Auth instance
  // baseUrl: process.env.REACT_APP_STACK_API_URL || "https://api.stack-auth.com",
});
