/**
 * Async generator that yields text characters one at a time with a delay.
 * Useful for creating streaming text effects.
 *
 * @param text - The complete text to stream
 * @param delayMs - Delay in milliseconds between each character (default: 50ms)
 * @yields Individual characters from the text
 *
 * @example
 * for await (const char of streamText("Hello", 30)) {
 *   console.log(char); // Prints 'H', 'e', 'l', 'l', 'o' with 30ms delays
 * }
 */
export async function* streamText(
  text: string,
  delayMs: number = 50
): AsyncGenerator<string> {
  const chars = text.split("");

  for (const char of chars) {
    yield char;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

/**
 * Simulates a streaming text response with character-by-character delivery.
 * Uses variable speed based on punctuation for a more natural typing effect.
 *
 * @param text - The complete text to stream
 * @param onChunk - Callback fired for each character with the character as argument
 * @param onComplete - Callback fired when streaming is complete
 * @param baseDelayMs - Base delay in milliseconds between characters (default: 30ms)
 * @returns A cancel function to stop the streaming early
 *
 * @example
 * const cancel = simulateStreamingResponse(
 *   "Hello, world!",
 *   (char) => setText(prev => prev + char),
 *   () => console.log("Done!"),
 *   30
 * );
 *
 * // To cancel: cancel();
 *
 * Speed variations:
 * - Spaces: 0.5x speed (15ms)
 * - Periods/!/?:  3x speed (90ms) - pause at sentence end
 * - Commas: 2x speed (60ms) - pause at clause
 * - Regular chars: 1x + random 0-30% variation (30-39ms)
 */
export function simulateStreamingResponse(
  text: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  baseDelayMs: number = 30
): () => void {
  const chars = text.split("");
  let index = 0;
  let cancelled = false;

  const getDelay = (char: string): number => {
    // Variable typing speed for more natural feel
    if (char === " ") return baseDelayMs * 0.5; // Faster for spaces
    if (char === "." || char === "!" || char === "?") return baseDelayMs * 3; // Pause at sentence end
    if (char === ",") return baseDelayMs * 2; // Pause at commas
    return baseDelayMs + Math.random() * baseDelayMs * 0.3; // Slight variation
  };

  const streamNext = () => {
    if (cancelled || index >= chars.length) {
      if (!cancelled) onComplete();
      return;
    }

    onChunk(chars[index]);
    const delay = getDelay(chars[index]);
    index++;
    setTimeout(streamNext, delay);
  };

  streamNext();

  return () => {
    cancelled = true;
  };
}
