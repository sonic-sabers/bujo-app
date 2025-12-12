import { ComponentType } from "../types/chat";

export interface ParsedComponent {
  type: "preset" | "dynamic";
  componentType?: ComponentType;
  componentData?: Record<string, unknown>;
  response: string;
}

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
      "Here are different button variations you can use: Primary for main actions, Secondary for less important actions and Ghost for subtle interactions. Each button is interactive and follows modern design patterns.",

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

interface DynamicPattern {
  patterns: string[];
  response: string;
  componentData: Record<string, unknown>;
}

const DYNAMIC_PATTERNS: DynamicPattern[] = [
  // Single button variants
  {
    patterns: ["ghost button", "ghost btn"],
    response:
      "Here's a ghost button - subtle and minimal, perfect for secondary actions:",
    componentData: { type: "button", variant: "ghost", text: "Ghost Button" },
  },
  {
    patterns: ["primary button", "primary btn", "main button"],
    response: "Here's a primary button - bold and prominent for main actions:",
    componentData: {
      type: "button",
      variant: "primary",
      text: "Primary Button",
    },
  },
  {
    patterns: ["secondary button", "secondary btn"],
    response:
      "Here's a secondary button - less prominent, for supporting actions:",
    componentData: {
      type: "button",
      variant: "secondary",
      text: "Secondary Button",
    },
  },
  {
    patterns: ["cta", "call to action", "action button"],
    response:
      "Here's a CTA button - designed to grab attention and drive conversions:",
    componentData: { type: "button", variant: "primary", text: "Get Started" },
  },
  {
    patterns: ["submit button", "submit btn"],
    response: "Here's a submit button for forms:",
    componentData: { type: "button", variant: "primary", text: "Submit" },
  },
  // Single card variants
  {
    patterns: ["elevated card", "shadow card"],
    response: "Here's an elevated card with prominent shadow:",
    componentData: { type: "card-group", variants: ["elevated"] },
  },
  {
    patterns: ["gradient card"],
    response: "Here's a gradient card for eye-catching designs:",
    componentData: { type: "card-group", variants: ["gradient"] },
  },
  {
    patterns: ["outlined card", "border card"],
    response: "Here's an outlined card with border-only style:",
    componentData: { type: "card-group", variants: ["outlined"] },
  },
  // Single input variants
  {
    patterns: ["email input", "email field"],
    response: "Here's an email input field:",
    componentData: {
      type: "input-group",
      inputs: [
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
      ],
    },
  },
  {
    patterns: ["search input", "search field", "search box"],
    response: "Here's a search input field:",
    componentData: {
      type: "input-group",
      inputs: [
        {
          name: "search",
          label: "Search",
          type: "search",
          placeholder: "Search...",
        },
      ],
    },
  },
  {
    patterns: ["password input", "password field"],
    response: "Here's a password input field:",
    componentData: {
      type: "input-group",
      inputs: [
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter password",
        },
      ],
    },
  },
  // Chat bubble variants
  {
    patterns: ["user bubble", "user message"],
    response: "Here's a user message bubble:",
    componentData: {
      type: "chat-group",
      messages: [
        { role: "user", text: "This is a user message", timestamp: "12:30" },
      ],
    },
  },
  {
    patterns: ["assistant bubble", "bot message", "assistant message"],
    response: "Here's an assistant message bubble:",
    componentData: {
      type: "chat-group",
      messages: [
        {
          role: "assistant",
          text: "This is an assistant response",
          timestamp: "12:31",
        },
      ],
    },
  },
  {
    patterns: ["system message", "system bubble"],
    response: "Here's a system message bubble:",
    componentData: {
      type: "chat-group",
      messages: [{ role: "system", text: "System notification" }],
    },
  },
  // Form elements
  {
    patterns: ["checkbox", "check box"],
    response: "Here's a checkbox component:",
    componentData: {
      type: "checkbox",
      props: { name: "agree", label: "I agree to the terms" },
    },
  },
  {
    patterns: ["contact form", "callback form"],
    response: "Here's a contact form:",
    componentData: {
      type: "ui-group",
      props: { title: "Contact Us" },
      events: { onSubmit: "formSubmitDemo" },
      components: [
        {
          type: "input",
          props: { name: "name", label: "Name", placeholder: "Your name" },
        },
        {
          type: "input",
          props: {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "you@example.com",
          },
        },
        { type: "button", variant: "primary", text: "Submit" },
      ],
    },
  },
  {
    patterns: ["login form", "signin form", "sign in form"],
    response: "Here's a login form:",
    componentData: {
      type: "ui-group",
      props: { title: "Login" },
      events: { onSubmit: "formSubmitDemo" },
      components: [
        {
          type: "input",
          props: {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "you@example.com",
          },
        },
        {
          type: "input",
          props: {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Password",
          },
        },
        { type: "button", variant: "primary", text: "Sign In" },
      ],
    },
  },
];

export function parseComponentFull(query: string): ParsedComponent {
  if (!query || typeof query !== "string") {
    return {
      type: "preset",
      response: "I can help you explore our component library!",
    };
  }

  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) {
    return {
      type: "preset",
      response: "I can help you explore our component library!",
    };
  }

  // Check dynamic patterns first (more specific)
  for (const pattern of DYNAMIC_PATTERNS) {
    if (pattern.patterns.some((p) => lowerQuery.includes(p))) {
      return {
        type: "dynamic",
        componentData: pattern.componentData,
        response: pattern.response,
      };
    }
  }

  // Fall back to preset component types
  const componentType = parseComponentQuery(query);
  if (componentType) {
    return {
      type: "preset",
      componentType,
      response: getComponentResponse(componentType),
    };
  }

  return {
    type: "preset",
    response:
      "I can help you explore our component library! Try asking about buttons, cards, inputs, or chat bubbles.",
  };
}
