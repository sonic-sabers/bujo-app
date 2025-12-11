export function ButtonPreview() {
  return (
    <div className="flex flex-col gap-3 items-center">
      <button className="px-6 py-2.5 bg-[#00b4d8] text-white rounded-lg font-medium hover:bg-[#0096b8] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
        <span>Primary</span>
        <svg
          className="w-4 h-4"
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
      </button>

      <button className="px-6 py-2.5 bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/30 rounded-lg font-medium hover:bg-[#00b4d8]/20 transition-colors flex items-center gap-2">
        <span>Secondary</span>
        <svg
          className="w-4 h-4"
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
      </button>
    </div>
  );
}
