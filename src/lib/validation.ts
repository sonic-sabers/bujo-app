/**
 * Centralized validation utilities for chat input
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates chat message input
 * @param content - The message content to validate
 * @returns Validation result with error message if invalid
 */
export function validateChatMessage(content: string): ValidationResult {
  if (!content) {
    return {
      isValid: false,
      error: "Message cannot be empty",
    };
  }

  const trimmed = content.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "Message cannot be only whitespace",
    };
  }

  if (trimmed.length > 1000) {
    return {
      isValid: false,
      error: "Message is too long (max 1000 characters)",
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes user input to prevent XSS
 * @param content - The content to sanitize
 * @returns Sanitized content
 */
export function sanitizeInput(content: string): string {
  return content
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .slice(0, 1000); // Enforce max length
}
