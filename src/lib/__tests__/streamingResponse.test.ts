import { streamText, simulateStreamingResponse } from "../streamingResponse";

describe("streamingResponse", () => {
  describe("streamText", () => {
    it("should yield characters one by one", async () => {
      const text = "Hello";
      const generator = streamText(text, 0); // 0ms delay for fast tests
      const chars: string[] = [];

      for await (const char of generator) {
        chars.push(char);
      }

      expect(chars).toEqual(["H", "e", "l", "l", "o"]);
    });

    it("should handle empty string", async () => {
      const generator = streamText("", 0);
      const chars: string[] = [];

      for await (const char of generator) {
        chars.push(char);
      }

      expect(chars).toEqual([]);
    });

    it("should handle special characters", async () => {
      const text = "Hi! How are you?";
      const generator = streamText(text, 0);
      const chars: string[] = [];

      for await (const char of generator) {
        chars.push(char);
      }

      expect(chars.join("")).toBe(text);
    });
  });

  describe("simulateStreamingResponse", () => {
    it("should call onChunk for each character", async () => {
      const chunks: string[] = [];
      const onChunk = jest.fn((chunk: string) => {
        chunks.push(chunk);
      });
      const onComplete = jest.fn();

      simulateStreamingResponse(
        "Hi",
        onChunk,
        onComplete,
        0 // 0ms delay for fast tests
      );

      // Wait for streaming to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(onChunk).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
      expect(chunks.join("")).toBe("Hi");
    });

    it("should call onComplete when done", async () => {
      const onChunk = jest.fn();
      const onComplete = jest.fn();

      simulateStreamingResponse("Test", onChunk, onComplete, 0);

      // Wait for streaming to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("should stop streaming when cancel is called", async () => {
      const chunks: string[] = [];
      const onChunk = jest.fn((chunk: string) => {
        chunks.push(chunk);
      });
      const onComplete = jest.fn();

      const cancel = simulateStreamingResponse(
        "Hello World",
        onChunk,
        onComplete,
        10 // Small delay
      );

      // Cancel immediately
      cancel();

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should have stopped early (not all characters)
      expect(chunks.length).toBeLessThan("Hello World".length);
    });

    it("should return cancel function", () => {
      const cancel = simulateStreamingResponse(
        "Test",
        () => {},
        () => {},
        0
      );

      expect(typeof cancel).toBe("function");
    });
  });
});
