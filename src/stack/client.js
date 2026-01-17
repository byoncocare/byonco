// src/stack/client.js
// Stack Auth client configuration - Production Ready
import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // Production keys - can be overridden with environment variables
  projectId: process.env.REACT_APP_STACK_PROJECT_ID || "5a629032-2f33-46db-ac2c-134894a117eb",
  publishableClientKey: process.env.REACT_APP_STACK_PUBLISHABLE_KEY || "pck_5cxgp4bnstpq82vjxxam2r9sbhkjw09xm00rcjw2cdaxg",
  tokenStore: "cookie", // Secure cookie storage
  redirectMethod: {
    useNavigate, // Use React Router for navigation
  },
  // Production URL configuration
  urls: {
    signIn: "/authentication",
    signUp: "/authentication",
    afterSignIn: "/",
    afterSignUp: "/",
  }
});
