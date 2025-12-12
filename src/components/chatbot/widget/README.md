 IMP Info: Added it as a part of side quest

# Bujo Chat Widget - Embeddable Bundle

A production-ready chat widget designed for high-traffic sites (1M+ visits/day).

## Production Features

- **Error Isolation** - Widget errors don't crash host app
- **Analytics Hooks** - Integrate with any analytics provider
- **Reduced Motion** - Respects `prefers-reduced-motion`
- **Preload on Hover** - Instant open experience
- **Code Splitting** - Minimal initial payload
- **SSR Safe** - No hydration issues

## Bundle Size Strategy

| Component         | Initial Load | On Demand              |
| ----------------- | ------------ | ---------------------- |
| FAB Button Shell  | ~5KB gzipped | -                      |
| ChatWindow + deps | -            | ~50-80KB gzipped       |
| framer-motion     | -            | Shared if host uses it |

## Usage

### Option 1: React Component (Recommended)

```tsx
import { EmbeddableWidget } from "@/components/chatbot/widget/EmbeddableWidget";

function App() {
  return (
    <div>
      <YourAppContent />
      <EmbeddableWidget
        themeColor="#00b4d8"
        position="bottom-right"
      />
    </div>
  );
}
```

### Option 2: Lazy-loaded Widget (Best for Code Splitting)

```tsx
import { ChatWidget } from "@/components/chatbot/widget";

// ChatWindow loads only when user opens the widget
function App() {
  return (
    <div>
      <YourAppContent />
      <ChatWidget />
    </div>
  );
}
```

### Option 3: Standalone Script (Non-React Sites)

```html
<!-- Add to your HTML -->
<script src="https://your-cdn.com/chat-widget.js"></script>
<script>
  BujoChat.init({
    themeColor: "#00b4d8",
    position: "bottom-right",
    onOpen: function () {
      console.log("Chat opened");
    },
    onClose: function () {
      console.log("Chat closed");
    },
  });
</script>
```

## Building Standalone Bundle

Add to `package.json`:

```json
{
  "scripts": {
    "build:widget": "esbuild src/components/chatbot/widget/standalone.tsx --bundle --minify --format=iife --global-name=BujoChat --outfile=public/chat-widget.js --loader:.tsx=tsx --external:react --external:react-dom"
  }
}
```

For a fully self-contained bundle (includes React):

```json
{
  "scripts": {
    "build:widget:standalone": "esbuild src/components/chatbot/widget/standalone.tsx --bundle --minify --format=iife --global-name=BujoChat --outfile=public/chat-widget.js --loader:.tsx=tsx"
  }
}
```

## Performance Optimizations

### 1. Preloading on Hover

The widget preloads the ChatWindow chunk when users hover over the FAB button, ensuring instant open.

### 2. Dynamic Imports

All heavy components use `next/dynamic` with `ssr: false`:

- ChatWindow
- ComponentRenderer
- JsonRenderer

### 3. Virtualized Message List

Uses `@tanstack/react-virtual` to render only visible messages, supporting 1000+ messages without performance degradation.

### 4. Batched State Updates

Streaming text updates are batched using `requestAnimationFrame` to reduce re-renders.

## Props

| Prop                | Type                              | Default          | Description                   |
| ------------------- | --------------------------------- | ---------------- | ----------------------------- |
| `themeColor`        | `string`                          | `#00b4d8`        | Primary color for the widget  |
| `position`          | `'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Widget position               |
| `zIndex`            | `number`                          | `50`             | Z-index for layering          |
| `onOpen`            | `() => void`                      | -                | Callback when widget opens    |
| `onClose`           | `() => void`                      | -                | Callback when widget closes   |
| `onError`           | `(error: Error) => void`          | -                | Error callback for monitoring |
| `disableAnimations` | `boolean`                         | `false`          | Disable all animations        |

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Dependencies (Peer)

For React apps, ensure these are installed:

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `framer-motion` >= 10.0.0 (optional, for animations)
