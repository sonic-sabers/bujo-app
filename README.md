# Bujo UI - Streamable UI Chatbot

An embeddable chat widget that acts as a "UI librarian" for component libraries. Users can request UI examples and receive live, interactive components rendered in the chat.

**🔗 Live Demo**: [https://bujo-app.vercel.app/](https://bujo-app.vercel.app/)

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Assignment Overview

This project implements the **Bujo AI Take-home Assignment**: a streamable UI chatbot for component libraries.

### Baseline Requirements ✅

| Requirement              | Implementation                                                      |
| ------------------------ | ------------------------------------------------------------------- |
| **Embeddable Widget**    | `<UiLibraryAssistant />` - self-contained, bottom-right FAB         |
| **Chat Interface**       | Message list, input box, loading states, scrollable history         |
| **Persistent Storage**   | IndexedDB with localStorage fallback (`storage.ts`)                 |
| **Streaming Behavior**   | Character-by-character with variable speed (`streamingResponse.ts`) |
| **UI Example Rendering** | Live interactive components via `ComponentRenderer`                 |

### Focus Directions Chosen

#### Direction A: Large Chat History (~1000 messages) ⭐ Production-Grade

#### Direction B: Streamable Markdown + JSON → Components

---

## Direction A: Large Chat History (Production-Grade) ⭐

This direction was treated as **production-grade**. Here's what that means:

### What "Production-Grade" Means

| Category                      | What I Did                                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Architecture**              | Separated concerns: `useChatState` hook for logic, `ChatWindow` for UI, `storage.ts` for persistence |
| **Performance**               | Virtualized rendering, batched updates, debounced saves, memoized components                         |
| **Error Handling**            | Error boundaries, retry functionality, graceful fallbacks (IndexedDB → localStorage)                 |
| **Memory Management**         | Proper cleanup of timeouts/refs on unmount, no memory leaks                                          |
| **DX (Developer Experience)** | TypeScript throughout, clear prop interfaces, documented code                                        |
| **UX**                        | Smooth scrolling, auto-scroll with user override, loading states, keyboard shortcuts                 |
| **Testing**                   | Unit tests with Jest for `componentParser`, `streamingResponse`; manual testing for UX flows         |

### Implementation

**Virtualization with @tanstack/react-virtual**

- Only visible messages are rendered in the DOM
- Handles 1000+ messages without performance degradation
- Dynamic row heights with automatic measurement

```typescript
// ChatWindow.tsx
const virtualizer = useVirtualizer({
  count: messages.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 100,
  overscan: 5, // Pre-render 5 items above/below viewport
});
```

### Production-Grade Details

| Aspect             | Implementation                                                                 |
| ------------------ | ------------------------------------------------------------------------------ |
| **Performance**    | Virtualized list renders only ~10-15 DOM nodes regardless of message count     |
| **Memory**         | Messages stored in IndexedDB (not memory) with pagination support              |
| **Scroll UX**      | Auto-scroll to bottom on new messages, pauses when user scrolls up             |
| **Streaming**      | Batched state updates during streaming (3-char buffer + requestAnimationFrame) |
| **Error Handling** | Error boundaries isolate failures, retry functionality for failed messages     |
| **Cleanup**        | Proper cleanup of timeouts/refs on unmount to prevent memory leaks             |

### Architecture Decisions

1. **IndexedDB over localStorage**: Handles larger datasets, async operations don't block UI
2. **Debounced saves**: 1-second debounce prevents excessive writes during streaming
3. **Ref-based scroll tracking**: Avoids re-renders while tracking scroll position
4. **Batched streaming updates**: Groups character updates to reduce React reconciliation
5. **Memoized components**: `React.memo` on `ChatMessage` and `ComponentRenderer` to prevent unnecessary re-renders

### IndexedDB Storage Implementation

#### Why IndexedDB over localStorage?

| Aspect                   | localStorage               | IndexedDB                    | Winner    |
| ------------------------ | -------------------------- | ---------------------------- | --------- |
| **Storage Limit**        | ~5MB                       | ~50MB+ (browser dependent)   | IndexedDB |
| **Data Type**            | Strings only               | Any (objects, blobs, arrays) | IndexedDB |
| **API Type**             | Synchronous (blocks UI)    | Asynchronous (non-blocking)  | IndexedDB |
| **Querying**             | None (full parse required) | Indexes, cursors, ranges     | IndexedDB |
| **Performance at Scale** | Degrades with size         | Consistent                   | IndexedDB |
| **Transactions**         | None                       | ACID transactions            | IndexedDB |

#### Performance Benefits for 1000+ Messages

```
localStorage (1000 messages):
├── Save: Parse entire array → Stringify → Write (blocks UI ~50-100ms)
├── Load: Read → Parse entire JSON (~30-50ms blocking)
└── Update 1 message: Load all → Modify → Save all (wasteful)

IndexedDB (1000 messages):
├── Save: Async transaction, no UI blocking
├── Load: Async with cursor/pagination support
└── Update 1 message: Direct put() by key (O(1) lookup)
```

#### Key Implementation Changes

```typescript
// OLD: localStorage approach (blocking)
const messages = JSON.parse(localStorage.getItem("messages") || "[]");
localStorage.setItem("messages", JSON.stringify(messages));

// NEW: IndexedDB approach (async, non-blocking)
const transaction = db.transaction(["chat-messages"], "readwrite");
const store = transaction.objectStore("chat-messages");
await store.put(message); // Direct upsert by ID
```

**What Changed:**

| Change             | Before                               | After                                |
| ------------------ | ------------------------------------ | ------------------------------------ |
| **Storage**        | `localStorage.setItem()`             | `IndexedDB.put()` with transactions  |
| **Retrieval**      | `JSON.parse(localStorage.getItem())` | `store.getAll()` with cursor support |
| **Updates**        | Load all → modify → save all         | Direct `put()` by message ID         |
| **Pagination**     | Not possible                         | `getMessagesPaginated(page, limit)`  |
| **Indexing**       | None                                 | Timestamp index for sorting          |
| **Error Recovery** | App crashes                          | Graceful fallback to localStorage    |

The `storage.ts` module provides persistent chat storage with comprehensive edge case handling:

```typescript
// Primary: IndexedDB for large datasets
// Fallback: localStorage for browser compatibility
const storage = getChatStorage();
await storage.saveMessages(messages);
await storage.loadMessages();
```

**Edge Cases Handled:**

| Edge Case                       | How It's Handled                                                     |
| ------------------------------- | -------------------------------------------------------------------- |
| **IndexedDB unavailable**       | Automatic fallback to localStorage                                   |
| **SSR (Server-Side Rendering)** | Checks `typeof window !== "undefined"` before accessing browser APIs |
| **DB connection failure**       | Falls back to localStorage, logs error                               |
| **Transaction errors**          | Try-catch with localStorage fallback                                 |
| **Corrupted data**              | Returns empty array, doesn't crash                                   |
| **Date serialization**          | Converts `Date` to ISO string for storage, parses back on load       |
| **Message ordering**            | Sorts by timestamp after loading to maintain correct order           |
| **Concurrent writes**           | Uses transactions with proper completion handlers                    |
| **Private browsing mode**       | localStorage fallback works in most private modes                    |

**Storage API:**

| Method                              | Description                                |
| ----------------------------------- | ------------------------------------------ |
| `saveMessages(messages)`            | Save all messages (clears existing)        |
| `loadMessages()`                    | Load all messages, sorted by timestamp     |
| `clearMessages()`                   | Clear all stored messages                  |
| `appendMessage(message)`            | Add single message (uses `put` for upsert) |
| `updateMessage(message)`            | Update existing message by ID              |
| `getMessagesPaginated(page, limit)` | Paginated loading for large histories      |

### Test Cases

**componentParser.test.ts** (20+ tests):

- Button detection: `"show me buttons"`, `"ghost button"`, `"cta"`
- Card detection: `"card component"`, `"elevated card"`
- Input detection: `"input field"`, `"text field"`, `"search box"`
- Chat bubble detection: `"chat bubble"`, `"message bubble"`
- Form detection: `"checkbox"`, `"toggle switch"`
- Edge cases: empty string, null input, unrelated queries
- Case insensitivity: `"SHOW ME BUTTONS"` → `"button-variants"`
- Dynamic vs preset: `"ghost button"` → dynamic, `"show me buttons"` → preset

**streamingResponse.test.ts**:

- Character-by-character streaming
- Empty string handling
- Special characters (punctuation)
- `onChunk` callback verification
- `onComplete` callback verification
- Cancel functionality (stops streaming early)

---

## Direction B: Streamable JSON → Components

### Implementation

The assistant returns structured data that the frontend renders as interactive components.

**Query Parsing** (`componentParser.ts`):

```typescript
// Preset components (full variants)
"show me buttons" → { componentType: "button-variants" }

// Dynamic components (specific variants)
"ghost button" → { componentData: { type: "button", variant: "ghost" } }

// Composite components
"login form" → {
  componentData: {
    type: "ui-group",
    components: [
      { type: "input", props: { name: "email", type: "email" } },
      { type: "input", props: { name: "password", type: "password" } },
      { type: "button", variant: "primary", text: "Sign In" }
    ]
  }
}
```

**Component Rendering** (`ComponentRenderer.tsx`):

- Maps `componentType` to preset example components
- Maps `componentData` to dynamically configured components
- Renders after streaming completes (`isStreaming: false`)

### Supported Component Types

| Type              | Trigger Keywords      | Renders                                        |
| ----------------- | --------------------- | ---------------------------------------------- |
| `button-variants` | button, btn, cta      | Primary, Secondary, Ghost, Destructive buttons |
| `card-variants`   | card, panel, tile     | Default, Elevated, Outlined, Gradient cards    |
| `input-variants`  | input, field, textbox | Text, Search, Email, Password inputs           |
| `chat-bubbles`    | bubble, message, chat | User, Assistant, System message styles         |
| `form-variants`   | form, checkbox, radio | Form elements with validation                  |

### Dynamic Patterns

| Query           | Renders                                 |
| --------------- | --------------------------------------- |
| "ghost button"  | Single ghost button                     |
| "login form"    | Email + Password inputs + Submit button |
| "contact form"  | Name + Email inputs + Submit button     |
| "elevated card" | Single elevated card                    |

---

## Tech Stack

| Category       | Technology               |
| -------------- | ------------------------ |
| Framework      | Next.js 16 (App Router)  |
| Language       | TypeScript               |
| Styling        | Tailwind CSS v4          |
| Animations     | Framer Motion            |
| Virtualization | @tanstack/react-virtual  |
| Storage        | IndexedDB + localStorage |

---

## Project Structure

```
src/
├── components/chatbot/
│   ├── UiLibraryAssistant.tsx   # Main widget entry point
│   ├── ChatWindow.tsx           # Virtualized chat container
│   ├── ChatMessage.tsx          # Message bubble (memoized)
│   ├── ChatInput.tsx            # Input with validation
│   ├── ComponentRenderer.tsx    # JSON → Component mapping
│   ├── JsonRenderer.tsx         # Dynamic component renderer
│   ├── TypingIndicator.tsx      # Animated typing dots
│   ├── QuickReplies.tsx         # Preset query buttons
│   ├── ErrorBoundary.tsx        # Error isolation
│   └── examples/                # Preset component examples
├── hooks/
│   ├── useChatState.ts          # Chat state + streaming logic
│   ├── useKeyboardShortcuts.ts  # Keyboard handlers
│   └── useDebounce.ts           # Debounce utility
├── lib/
│   ├── componentParser.ts       # Query → component mapping
│   ├── streamingResponse.ts     # Character streaming
│   └── storage.ts               # IndexedDB persistence
└── types/
    └── chat.ts                  # Message types
```

---

## Usage

```tsx
import { UiLibraryAssistant } from "@/components/chatbot/UiLibraryAssistant";

export default function Page() {
  return (
    <div>
      <YourContent />
      <UiLibraryAssistant />
    </div>
  );
}
```

### Try These Queries

- "Show me button variations"
- "Display card examples"
- "Input field types"
- "Chat bubble styles"
- "Show me a login form"
- "Ghost button"

---

## Assumptions, Trade-offs & Limitations

### Assumptions

1. **Enterprise-scale ready**: Architecture designed to handle high-volume usage typical of B2C enterprise support (Bujo's target market)
2. **Mock streaming for demo**: Uses client-side keyword matching; production would integrate with Bujo's AI backend/LLM
3. **IndexedDB available**: Falls back to localStorage; enterprise deployment could use server-side persistence
4. **Modern browser support**: Targets browsers used by enterprise customers (Chrome, Safari, Edge, Firefox)

### Trade-offs

| Decision                | Trade-off                      | Enterprise Consideration                                            |
| ----------------------- | ------------------------------ | ------------------------------------------------------------------- |
| **Virtualization**      | Adds complexity                | Essential for long support conversations (1000+ messages)           |
| **Keyword matching**    | Demo-only; limited             | Production: Replace with Bujo's AI agents for natural conversations |
| **Character streaming** | More state updates             | Matches enterprise chat UX expectations                             |
| **IndexedDB**           | More complex than localStorage | Handles enterprise-scale conversation history                       |
| **Error boundaries**    | Extra wrapper components       | Critical for 24/7 uptime in customer support                        |

### Production-Ready Considerations

For Bujo's enterprise scale (high-volume B2C support):

| Aspect             | Current Implementation | Production Enhancement                       |
| ------------------ | ---------------------- | -------------------------------------------- |
| **AI Backend**     | Mock keyword matching  | Integrate Bujo's conversational AI agents    |
| **Persistence**    | Client-side IndexedDB  | Server-side with user authentication         |
| **Analytics**      | None                   | Track resolution rates, conversation metrics |
| **Multi-language** | English only           | Bujo's multi-language support                |
| **Brand Voice**    | Generic                | Configurable per-enterprise brand guidelines |
| **Compliance**     | Basic                  | Enterprise compliance requirements           |

### Limitations (Demo Scope)

1. **No real AI integration**: Demo uses pattern matching; production uses Bujo's AI
2. **Client-side only**: No server persistence or user authentication
3. **Single conversation**: Enterprise would support conversation history per user
4. **No handoff**: Production would include human agent escalation

### Known Issues

- `@tanstack/react-virtual` produces a `flushSync` warning during streaming (suppressed, doesn't affect functionality)

---

## Keyboard Shortcuts

| Key            | Action       |
| -------------- | ------------ |
| `Escape`       | Close chat   |
| `Cmd/Ctrl + K` | Clear chat   |
| `Enter`        | Send message |

---

## Screenshots

### Chat Widget

![Chat Default](./public/Chat%20default.png)
![Chat Answer](./public/Chat%20Answer.png)

### Component Rendering

![Chat Result](./public/chat%20result%201.png)
![Search Result](./public/Search%20result%202.png)

---
