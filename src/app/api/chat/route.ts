import { NextRequest } from "next/server";
import {
  parseComponentQuery,
  getComponentResponse,
} from "@/lib/componentParser";

export const runtime = "edge";

// Info: I have added intentionally as dummy POST api call, currently its getting streamed from locally only.
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response("Invalid message", { status: 400 });
    }

    const componentType = parseComponentQuery(message);
    const responseText = componentType
      ? getComponentResponse(componentType)
      : "I can help you explore our component library! Try asking about buttons, cards, inputs, or chat bubbles.";

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const chars = responseText.split("");

        for (let i = 0; i < chars.length; i++) {
          const char = chars[i];

          const chunk = JSON.stringify({
            type: "text",
            content: char,
            componentType: i === chars.length - 1 ? componentType : null,
          });

          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));

          const delay =
            char === " "
              ? 15
              : char === "." || char === "!" || char === "?"
              ? 90
              : char === ","
              ? 60
              : 30 + Math.random() * 10;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
