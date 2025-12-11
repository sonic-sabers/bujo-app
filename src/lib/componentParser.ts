import { ComponentType } from "@/types/chat";

/**
 * Pattern matching configuration for component detection.
 * Ordered by specificity (most specific first) to avoid false matches.
 */
interface ComponentPattern {
  type: ComponentType;
  keywords: string[];
  phrases: string[];
  combinations?: Array<{ all: string[] }>;
}

const COMPONENT_PATTERNS: ComponentPattern[] = [
  // Chat bubbles - Most specific first to avoid conflicts
  {
    type: "chat-bubbles",
    keywords: ["bubble", "message"],
    phrases: [
      "chat bubble",
      "message bubble",
      "chat layout",
      "chat message",
      "conversation bubble",
      "speech bubble",
    ],
    combinations: [{ all: ["chat", "message"] }, { all: ["message", "style"] }],
  },
  // Buttons
  {
    type: "button-variants",
    keywords: ["button", "btn", "cta"],
    phrases: [
      "button",
      "ghost button",
      "action button",
      "submit button",
      "click button",
    ],
    combinations: [
      { all: ["primary", "secondary"] },
      { all: ["button", "variant"] },
    ],
  },
  // Inputs
  {
    type: "input-variants",
    keywords: ["input", "field", "textbox", "textarea"],
    phrases: [
      "text field",
      "input field",
      "search field",
      "email field",
      "form field",
      "text input",
      "search box",
    ],
    combinations: [{ all: ["search", "field"] }, { all: ["text", "input"] }],
  },
  // Cards
  {
    type: "card-variants",
    keywords: ["card", "panel", "tile"],
    phrases: [
      "card",
      "card component",
      "info card",
      "content card",
      "card layout",
    ],
    combinations: [
      { all: ["elevated", "outlined"] },
      { all: ["card", "style"] },
    ],
  },
  // Forms
  {
    type: "form-variants",
    keywords: ["form", "checkbox", "radio", "toggle", "select", "dropdown"],
    phrases: [
      "form element",
      "form control",
      "checkbox",
      "radio button",
      "toggle switch",
      "select menu",
      "dropdown menu",
    ],
    combinations: [
      { all: ["form", "component"] },
      { all: ["checkbox", "radio"] },
    ],
  },
];

/**
 * Checks if a query contains a specific phrase using word boundaries.
 * More accurate than simple includes() as it respects word boundaries.
 *
 * @param query - The query string to search in
 * @param phrase - The phrase to search for
 * @returns True if the phrase is found with word boundaries
 */
function containsPhrase(query: string, phrase: string): boolean {
  // Escape special regex characters in the phrase
  const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Use word boundaries for more accurate matching
  const regex = new RegExp(`\\b${escapedPhrase}\\b`, "i");
  return regex.test(query);
}

/**
 * Parses a user's natural language query to detect component requests.
 * Uses enhanced keyword matching with word boundaries and priority ordering.
 *
 * @param query - The user's input message (e.g., "Show me button variations")
 * @returns The detected ComponentType or null if no component is detected
 *
 * @example
 * parseComponentQuery("Show me different buttons") // Returns "button-variants"
 * parseComponentQuery("I need card examples") // Returns "card-variants"
 * parseComponentQuery("Hello") // Returns null
 *
 * Improvements:
 * - Word boundary detection for more accurate matching
 * - Priority-based ordering (specific patterns first)
 * - Expanded keyword coverage
 * - Phrase matching for multi-word patterns
 * - Combination matching for complex queries
 */
export function parseComponentQuery(query: string): ComponentType | null {
  if (!query || typeof query !== "string") return null;

  const lowerQuery = query.toLowerCase().trim();

  // Empty query check
  if (!lowerQuery) return null;

  // Iterate through patterns in priority order
  for (const pattern of COMPONENT_PATTERNS) {
    // Check exact phrases first (highest priority)
    if (pattern.phrases.some((phrase) => containsPhrase(lowerQuery, phrase))) {
      return pattern.type;
    }

    // Check keyword combinations
    if (pattern.combinations) {
      for (const combo of pattern.combinations) {
        if (combo.all.every((keyword) => lowerQuery.includes(keyword))) {
          return pattern.type;
        }
      }
    }

    // Check individual keywords (lowest priority)
    if (pattern.keywords.some((keyword) => lowerQuery.includes(keyword))) {
      return pattern.type;
    }
  }

  return null;
}

/**
 * Generates a descriptive response text for a given component type.
 * This text is streamed to the user before the actual component is rendered.
 *
 * @param componentType - The type of component to describe
 * @returns A descriptive text explaining the component variations
 *
 * @example
 * getComponentResponse("button-variants")
 * // Returns: "Here are different button variations you can use: Primary for main actions..."
 */
export function getComponentResponse(componentType: ComponentType): string {
  if (!componentType) return "I can help you explore our component library!";

  const responses: Record<string, string> = {
    "button-variants":
      "Here are different button variations you can use: Primary for main actions, Secondary for less important actions, Ghost for subtle interactions, and Destructive for delete operations. Each button is interactive and follows modern design patterns.",

    "card-variants":
      "I'll show you various card components: Default cards with subtle shadows, Elevated cards with prominent shadows for emphasis, Outlined cards with borders, and Gradient cards for eye-catching designs. All cards have hover animations.",

    "input-variants":
      "Here are different input field types: Default text inputs, Search inputs with icons, Email inputs with validation styling, and Error states showing validation feedback. Each input has focus states and proper accessibility.",

    "chat-bubbles":
      "Let me show you chat bubble variations: User messages (right-aligned with blue gradient), Assistant messages (left-aligned with white background), Gradient bubbles for special messages, and System messages. All include timestamps and proper spacing.",

    "form-variants":
      "Here are form component examples including checkboxes, radio buttons, toggles, and select menus. Each component follows accessibility best practices and has proper states (default, hover, active, disabled).",
  };

  return responses[componentType] || "Here are the components you requested:";
}
