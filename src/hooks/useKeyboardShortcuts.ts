import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  description: string;
}

/**
 * Custom hook for managing keyboard shortcuts
 * @param shortcuts - Array of keyboard shortcut configurations
 * @param enabled - Whether shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : true;
        const metaMatch = shortcut.metaKey ? event.metaKey : true;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : true;

        if (
          event.key === shortcut.key &&
          ctrlMatch &&
          metaMatch &&
          shiftMatch
        ) {
          event.preventDefault();
          shortcut.callback();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, enabled]);
}
