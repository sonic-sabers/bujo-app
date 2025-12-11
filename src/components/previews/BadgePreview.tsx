export function BadgePreview() {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-center">
      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3" />
        </svg>
        Error
      </span>

      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3" />
        </svg>
        Success
      </span>

      <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3" />
        </svg>
        Info
      </span>

      <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3" />
        </svg>
        Warning
      </span>
    </div>
  );
}
