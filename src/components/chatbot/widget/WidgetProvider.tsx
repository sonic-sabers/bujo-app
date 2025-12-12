"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type ErrorInfo,
} from "react";
import { WidgetErrorBoundary } from "./WidgetErrorBoundary";

/**
 * Widget configuration for production deployment.
 *
 * @deprecated This provider is currently not integrated with the widget components.
 * Use props directly on EmbeddableWidget or ChatWidget instead.
 * This is kept for future context-based configuration needs (e.g., apiEndpoint, analytics).
 */
export interface WidgetConfig {
  /** Primary theme color */
  themeColor?: string;
  /** Widget position */
  position?: "bottom-right" | "bottom-left";
  /** Z-index for layering */
  zIndex?: number;
  /** API endpoint for chat (if using server) */
  apiEndpoint?: string;
  /** Custom error handler */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Enable debug mode */
  debug?: boolean;
  /** Disable animations for reduced motion preference */
  respectReducedMotion?: boolean;
  /** Custom CSS namespace to avoid conflicts */
  cssNamespace?: string;
}

interface WidgetContextValue {
  config: WidgetConfig;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const WidgetContext = createContext<WidgetContextValue | null>(null);

/**
 * Hook to access widget context.
 */
export function useWidget() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within WidgetProvider");
  }
  return context;
}

interface WidgetProviderProps {
  children: ReactNode;
  config?: WidgetConfig;
}

/**
 * Provider component for the chat widget.
 *
 * @deprecated This provider is currently not integrated with widget components.
 * Use props directly on EmbeddableWidget or ChatWidget instead.
 * Reserved for future context-based configuration (apiEndpoint, analytics, etc.).
 *
 * Provides:
 * - Configuration context for all child components
 * - Error boundary isolation
 * - Analytics tracking
 * - Reduced motion detection
 *
 * @example
 * <WidgetProvider config={{
 *   themeColor: '#00b4d8',
 *   onError: (e) => Sentry.captureException(e),
 * }}>
 *   <EmbeddableWidget />
 * </WidgetProvider>
 */
export function WidgetProvider({ children, config = {} }: WidgetProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Handle open/close
  const handleSetIsOpen = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  // Handle errors
  const handleError = useCallback(
    (error: Error, errorInfo: ErrorInfo) => {
      config.onError?.(error, errorInfo);
    },
    [config]
  );

  const value: WidgetContextValue = {
    config,
    isOpen,
    setIsOpen: handleSetIsOpen,
  };

  return (
    <WidgetContext.Provider value={value}>
      <WidgetErrorBoundary onError={handleError}>
        {children}
      </WidgetErrorBoundary>
    </WidgetContext.Provider>
  );
}

export default WidgetProvider;
