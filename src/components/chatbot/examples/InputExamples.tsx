"use client";

interface InputExamplesProps {
  hideHeader?: boolean;
}

export function InputExamples({ hideHeader = false }: InputExamplesProps) {
  return (
    <div className="relative bg-gray-50 rounded-lg">
      {!hideHeader && (
        <div className="pb-2">
          <h4 className="font-semibold text-gray-900 mb-3">Input Variations</h4>
        </div>
      )}

      <div
        className={` pb-4 space-y-3 w-full ${
          hideHeader ? "max-h-[300px] pb-6 overflow-hidden px-6 " : ""
        }`}
      >
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Default Input
          </label>
          <input
            type="text"
            placeholder="Enter text..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00b4d8] focus:border-[#00b4d8] placeholder:text-gray-400 text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Search Input
          </label>
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00b4d8] focus:border-[#00b4d8] placeholder:text-gray-400 text-gray-900 bg-white"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Email Input
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00b4d8] focus:border-[#00b4d8] placeholder:text-gray-400 text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Error State
          </label>
          <input
            type="text"
            placeholder="Invalid input"
            className="w-full px-4 py-2 border-2 border-red-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-gray-400 text-gray-900 bg-white"
          />
          <p className="text-xs text-red-600 mt-1">This field is required</p>
        </div>
      </div>

      {/* Bottom fade effect */}
      {hideHeader && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none rounded-b-lg" />
      )}
    </div>
  );
}
