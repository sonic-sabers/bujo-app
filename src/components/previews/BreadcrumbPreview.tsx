export function BreadcrumbPreview() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <div className="h-2 w-12 bg-gray-300 rounded"></div>
      </div>
      <svg
        className="w-3 h-3 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
      <div className="h-2 w-16 bg-gray-300 rounded"></div>
      <svg
        className="w-3 h-3 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
      <div className="h-2 w-14 bg-gray-400 rounded"></div>
    </div>
  );
}
