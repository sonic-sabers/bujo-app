export function DropdownPreview() {
  return (
    <div className="w-full max-w-xs">
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg">
        <div className="p-2 border-b border-gray-200">
          <div className="h-2 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="p-1 space-y-1">
          <div className="h-8 bg-gray-100 rounded"></div>
          <div className="h-8 bg-gray-50 rounded"></div>
          <div className="h-8 bg-gray-50 rounded"></div>
        </div>
      </div>
    </div>
  );
}
