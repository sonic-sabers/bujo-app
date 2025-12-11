export function AccordionPreview() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="border border-gray-300 rounded-lg bg-white">
        <div className="p-3 flex items-center justify-between">
          <div className="h-2 w-32 bg-gray-300 rounded"></div>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
      <div className="border border-gray-300 rounded-lg bg-white">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="h-2 w-32 bg-gray-300 rounded"></div>
            <div className="h-2 w-2 bg-gray-300 rounded"></div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-gray-200 rounded"></div>
            <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="border border-gray-300 rounded-lg bg-white">
        <div className="p-3 flex items-center justify-between">
          <div className="h-2 w-32 bg-gray-300 rounded"></div>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
