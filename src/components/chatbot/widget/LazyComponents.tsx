"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-loaded components for the chat widget.
 * Each component is loaded as a separate chunk to minimize initial bundle size.
 */

export const LazyChatWindow = dynamic(
  () => import("../ChatWindow").then((mod) => ({ default: mod.ChatWindow })),
  { ssr: false }
);

export const LazyComponentRenderer = dynamic(
  () =>
    import("../ComponentRenderer").then((mod) => ({
      default: mod.ComponentRenderer,
    })),
  { ssr: false }
);

export const LazyJsonRenderer = dynamic(
  () =>
    import("../JsonRenderer").then((mod) => ({
      default: mod.JsonRenderer,
    })),
  { ssr: false }
);

/**
 * Preload critical components when user hovers over the chat button.
 * This improves perceived performance by loading before the click.
 */
export function preloadChatComponents() {
  import("../ChatWindow").catch(() => {
    // Silently fail - component will load on demand
  });
}
