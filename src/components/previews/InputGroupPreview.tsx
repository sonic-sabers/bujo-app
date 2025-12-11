export function InputGroupPreview() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-9 bg-white border-2 border-gray-300 rounded-lg flex items-center px-3">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
