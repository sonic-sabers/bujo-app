export function FooterPreview() {
  return (
    <div className="w-full max-w-sm bg-slate-800 rounded-lg p-4">
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="space-y-2">
          <div className="h-2 w-12 bg-slate-600 rounded"></div>
          <div className="h-1.5 w-16 bg-slate-700 rounded"></div>
          <div className="h-1.5 w-14 bg-slate-700 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-12 bg-slate-600 rounded"></div>
          <div className="h-1.5 w-16 bg-slate-700 rounded"></div>
          <div className="h-1.5 w-14 bg-slate-700 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-12 bg-slate-600 rounded"></div>
          <div className="h-1.5 w-16 bg-slate-700 rounded"></div>
          <div className="h-1.5 w-14 bg-slate-700 rounded"></div>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-3">
        <div className="h-1.5 w-32 bg-slate-700 rounded mx-auto"></div>
      </div>
    </div>
  );
}
