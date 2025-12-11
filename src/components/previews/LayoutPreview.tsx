export function LayoutPreview() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-20 bg-gray-200 rounded-lg"></div>
        <div className="h-20 bg-gray-300 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-20 bg-gray-300 rounded-lg"></div>
        <div className="h-20 bg-gray-300 rounded-lg"></div>
        <div className="h-20 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
}
