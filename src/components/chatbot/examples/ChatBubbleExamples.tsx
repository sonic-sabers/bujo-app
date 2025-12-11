"use client";

interface ChatBubbleExamplesProps {
  hideHeader?: boolean;
}

export function ChatBubbleExamples({
  hideHeader = false,
}: ChatBubbleExamplesProps) {
  return (
    <div className="relative bg-gray-50 rounded-lg">
      {!hideHeader && (
        <div className="p-4 pb-2">
          <h4 className="font-semibold text-gray-900 mb-3">
            Chat Bubble Variations
          </h4>
        </div>
      )}

      <div
        className={` pb-4 space-y-3 w-full ${
          hideHeader ? "max-h-[300px] pb-6 overflow-hidden px-6 " : ""
        }`}
      >
        <div className="flex justify-end">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[70%]">
            <p className="text-sm">User message bubble</p>
            <span className="text-xs opacity-75">2:30 PM</span>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%] shadow-sm border border-gray-200">
            <p className="text-sm">Assistant message bubble</p>
            <span className="text-xs text-gray-500">2:31 PM</span>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[70%]">
            <p className="text-sm">Gradient user bubble</p>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%]">
            <p className="text-sm">System message</p>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      {hideHeader && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none rounded-b-lg" />
      )}
    </div>
  );
}
