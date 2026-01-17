// src/components/Security/SecurityProtection.jsx
// Security protection component - prevents casual scraping while maintaining SEO

import React, { useEffect, useRef } from 'react';
import { isLegitimateCrawler, detectHeadlessBrowser, logSecurityEvent } from '@/utils/security/antiScraping';

/**
 * SecurityProtection component
 * 
 * Applies anti-scraping measures:
 * - Disables right-click on non-input elements
 * - Disables copy/paste on static content (not forms)
 * - Disables text selection on sensitive blocks
 * - Detects and logs headless browsers
 * 
 * SEO-friendly: Does NOT block legitimate crawlers
 * Accessibility-friendly: Does NOT break form functionality
 */
export default function SecurityProtection({ 
  children, 
  disableRightClick = true,
  disableCopyPaste = true,
  disableTextSelection = false,
  sensitiveSelector = null, // CSS selector for sensitive blocks
  allowDevTools = false, // Allow DevTools shortcuts (for debugging)
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Skip all protections for legitimate crawlers
    if (isLegitimateCrawler()) {
      return;
    }

    // Skip all protections on Stack Auth handler routes (OAuth callbacks need to work)
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/handler/')) {
      return;
    }

    // Detect headless browsers
    if (detectHeadlessBrowser()) {
      logSecurityEvent('headless_browser_detected', {
        userAgent: navigator.userAgent,
      });
    }

    // Disable right-click context menu on non-input elements
    const handleContextMenu = (e) => {
      if (!disableRightClick) return;
      
      // Allow right-click on input, textarea, and select elements
      const target = e.target;
      const isInputElement = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable ||
        target.closest('input, textarea, select, [contenteditable="true"]');

      if (!isInputElement) {
        e.preventDefault();
        logSecurityEvent('right_click_blocked', {
          element: target.tagName,
          className: target.className,
        });
      }
    };

    // Disable copy/paste on static content (not forms)
    const handleCopy = (e) => {
      if (!disableCopyPaste) return;

      const target = e.target;
      const isFormElement = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('input, textarea, [contenteditable="true"]');

      // Allow copy in form elements
      if (!isFormElement) {
        e.preventDefault();
        logSecurityEvent('copy_blocked', {
          element: target.tagName,
        });
        return false;
      }
    };

    const handleCut = (e) => {
      if (!disableCopyPaste) return;

      const target = e.target;
      const isFormElement = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('input, textarea, [contenteditable="true"]');

      if (!isFormElement) {
        e.preventDefault();
        logSecurityEvent('cut_blocked', {
          element: target.tagName,
        });
        return false;
      }
    };

    const handlePaste = (e) => {
      if (!disableCopyPaste) return;

      const target = e.target;
      const isFormElement = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('input, textarea, [contenteditable="true"]');

      // Allow paste in form elements
      if (!isFormElement) {
        e.preventDefault();
        logSecurityEvent('paste_blocked', {
          element: target.tagName,
        });
        return false;
      }
    };

    // Disable text selection on sensitive blocks only
    const handleSelectStart = (e) => {
      if (!disableTextSelection) return;

      const target = e.target;
      
      // Allow selection in form elements
      const isFormElement = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('input, textarea, [contenteditable="true"]');

      if (isFormElement) return;

      // If sensitiveSelector is provided, only block selection in those elements
      if (sensitiveSelector) {
        const sensitiveElement = target.closest(sensitiveSelector);
        if (sensitiveElement) {
          e.preventDefault();
          return false;
        }
      } else {
        // Block selection on all non-form elements
        e.preventDefault();
        return false;
      }
    };

    // Disable drag and drop of images (prevents image saving)
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        logSecurityEvent('image_drag_blocked');
        return false;
      }
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U (developer tools shortcuts)
    // BUT: Allow if allowDevTools prop is true, or in development/localhost
    const handleKeyDown = (e) => {
      // Allow DevTools if explicitly allowed, in development, or on localhost
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('localhost');
      
      if (allowDevTools || isDevelopment || isLocalhost) {
        // Don't block DevTools
        return;
      }

      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        logSecurityEvent('devtools_shortcut_blocked', { key: 'F12' });
        return false;
      }

      // Ctrl+Shift+I (Chrome DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        logSecurityEvent('devtools_shortcut_blocked', { key: 'Ctrl+Shift+I' });
        return false;
      }

      // Ctrl+Shift+J (Chrome Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        logSecurityEvent('devtools_shortcut_blocked', { key: 'Ctrl+Shift+J' });
        return false;
      }

      // Ctrl+U (View Source) - Allow in forms
      if (e.ctrlKey && e.key === 'u') {
        const target = e.target;
        const isFormElement = 
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;
        
        if (!isFormElement) {
          e.preventDefault();
          logSecurityEvent('view_source_blocked');
          return false;
        }
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        const target = e.target;
        const isFormElement = 
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;
        
        if (!isFormElement) {
          e.preventDefault();
          logSecurityEvent('save_page_blocked');
          return false;
        }
      }
    };

    // Attach event listeners
    const container = containerRef.current || document;
    
    container.addEventListener('contextmenu', handleContextMenu);
    container.addEventListener('copy', handleCopy);
    container.addEventListener('cut', handleCut);
    container.addEventListener('paste', handlePaste);
    container.addEventListener('selectstart', handleSelectStart);
    container.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      container.removeEventListener('contextmenu', handleContextMenu);
      container.removeEventListener('copy', handleCopy);
      container.removeEventListener('cut', handleCut);
      container.removeEventListener('paste', handlePaste);
      container.removeEventListener('selectstart', handleSelectStart);
      container.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [disableRightClick, disableCopyPaste, disableTextSelection, sensitiveSelector]);

  // Apply CSS to disable text selection on sensitive blocks
  useEffect(() => {
    if (!disableTextSelection || isLegitimateCrawler()) return;

    const style = document.createElement('style');
    style.id = 'security-protection-styles';
    
    if (sensitiveSelector) {
      style.textContent = `
        ${sensitiveSelector} {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        ${sensitiveSelector} input,
        ${sensitiveSelector} textarea,
        ${sensitiveSelector} [contenteditable="true"] {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `;
    } else {
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        input, textarea, [contenteditable="true"] {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `;
    }

    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('security-protection-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [disableTextSelection, sensitiveSelector]);

  return <div ref={containerRef}>{children}</div>;
}
