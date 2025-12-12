import { ComponentType } from "@/types/chat";

export interface StreamChunkResponse {
  type: "text" | "done";
  content: string;
  componentType?: ComponentType;
  componentData?: Record<string, unknown>;
}
// Info: I have added intentionally as dummy api call, currently its getting streamed from locally only.

/**
 * Sends a message to the chat API and handles the streaming response.
 *
 * @param message - The user's message
 * @param onChunk - Callback for each text chunk received
 * @param onComplete - Callback when streaming is complete
 * @param onError - Callback for errors
 * @returns A cancel function to abort the request
 */
export async function sendChatMessage(
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: (
    componentType: ComponentType,
    componentData?: Record<string, unknown>
  ) => void,
  onError: (error: Error) => void
): Promise<() => void> {
  const abortController = new AbortController();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalComponentType: ComponentType = null;
    let finalComponentData: Record<string, unknown> | undefined = undefined;

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            onComplete(finalComponentType, finalComponentData);
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              try {
                const parsed: StreamChunkResponse = JSON.parse(data);

                if (parsed.type === "text") {
                  onChunk(parsed.content);
                  if (parsed.componentType) {
                    finalComponentType = parsed.componentType;
                  }
                  if (parsed.componentData) {
                    finalComponentData = parsed.componentData;
                  }
                } else if (parsed.type === "done") {
                  onComplete(finalComponentType, finalComponentData);
                  return;
                }
              } catch (e) {
                console.error("Failed to parse SSE data:", e);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          onError(error);
        }
      }
    };

    processStream();
  } catch (error) {
    if (error instanceof Error && error.name !== "AbortError") {
      onError(error);
    }
  }

  return () => abortController.abort();
}
