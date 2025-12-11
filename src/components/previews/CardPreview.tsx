export function CardPreview() {
  return (
    <div className="w-full max-w-xs bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <div className="h-24 bg-gradient-to-br from-blue-100 to-purple-100"></div>
      <div className="p-4 space-y-2">
        <div className="h-3 w-32 bg-gray-300 rounded"></div>
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-gray-200 rounded"></div>
          <div className="h-2 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-2 w-4/6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
