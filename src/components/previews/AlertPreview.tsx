export function AlertPreview() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-2 w-24 bg-green-300 rounded"></div>
          <div className="h-1.5 w-full bg-green-200 rounded"></div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
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
        <div className="flex-1 space-y-1">
          <div className="h-2 w-24 bg-red-300 rounded"></div>
          <div className="h-1.5 w-full bg-red-200 rounded"></div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-2 w-24 bg-blue-300 rounded"></div>
          <div className="h-1.5 w-full bg-blue-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
