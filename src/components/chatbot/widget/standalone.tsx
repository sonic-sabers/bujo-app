"use client";

/**
 * Standalone Widget Entry Point
 *
 * This file serves as the entry point for building the chat widget
 * as a standalone bundle that can be embedded in any website.
 *
 * Build command (add to package.json):
 * "build:widget": "next build && npm run build:standalone"
 *
 * For standalone UMD bundle, you would use a tool like Rollup or esbuild:
 * esbuild src/components/chatbot/widget/standalone.tsx --bundle --minify --outfile=dist/chat-widget.js
 */

import { createRoot } from "react-dom/client";
import {
  EmbeddableWidget,
  type EmbeddableWidgetProps,
} from "./EmbeddableWidget";

declare global {
  interface Window {
    BujoChat?: {
      init: (config?: EmbeddableWidgetProps) => void;
      destroy: () => void;
    };
  }
}

let root: ReturnType<typeof createRoot> | null = null;
let container: HTMLDivElement | null = null;

/**
 * Initialize the chat widget on the page.
 *
 * @example
 * // Via script tag:
 * <script src="https://cdn.example.com/chat-widget.js"></script>
 * <script>
 *   BujoChat.init({
 *     themeColor: '#00b4d8',
 *     position: 'bottom-right',
 *     onOpen: () => console.log('Chat opened'),
 *     onClose: () => console.log('Chat closed'),
 *   });
 * </script>
 */
function init(config: EmbeddableWidgetProps = {}) {
  if (container) {
    console.warn("BujoChat is already initialized");
    return;
  }

  container = document.createElement("div");
  container.id = "bujo-chat-widget-root";
  container.style.cssText =
    "position: fixed; z-index: 9999; pointer-events: none;";
  document.body.appendChild(container);

  root = createRoot(container);
  root.render(
    <div style={{ pointerEvents: "auto" }}>
      <EmbeddableWidget {...config} />
    </div>
  );
}

/**
 * Remove the chat widget from the page.
 */
function destroy() {
  if (root) {
    root.unmount();
    root = null;
  }
  if (container) {
    container.remove();
    container = null;
  }
}

// Expose global API for non-React consumers
if (typeof window !== "undefined") {
  window.BujoChat = {
    init,
    destroy,
  };
}

export { init, destroy, EmbeddableWidget };
export type { EmbeddableWidgetProps };
