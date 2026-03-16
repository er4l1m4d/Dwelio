export default function MessagesSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse flex-col gap-3 rounded-3xl border border-emerald-100 bg-white/90 p-5"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 rounded-full bg-slate-200" />
            <div className="h-3 w-3 rounded-full bg-slate-200" />
          </div>
          <div className="h-3 w-3/4 rounded-full bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
