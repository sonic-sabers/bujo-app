export function AvatarPreview() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white"
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
  );
}
