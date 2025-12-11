export function ChatBubblePreview() {
  return (
    <div className="w-full max-w-xs space-y-3">
      {/* User message bubble */}
      <div className="flex justify-end">
        <div className="px-4 py-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-sm max-w-[80%]">
          <p className="text-xs">Hello!</p>
        </div>
      </div>

      {/* Assistant message bubble */}
      <div className="flex justify-start">
        <div className="px-4 py-2 bg-white border-2 border-gray-200 rounded-2xl rounded-bl-sm max-w-[80%]">
          <p className="text-xs text-gray-700">Hi there! How can I help?</p>
        </div>
      </div>
    </div>
  );
}
