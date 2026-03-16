export default function PropertyCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_20px_50px_rgba(16,42,24,0.08)]">
      <div className="h-44 w-full bg-emerald-50" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded-full bg-slate-200" />
        <div className="h-3 w-1/2 rounded-full bg-slate-200" />
        <div className="mt-3 flex gap-3">
          <div className="h-3 w-12 rounded-full bg-slate-200" />
          <div className="h-3 w-12 rounded-full bg-slate-200" />
        </div>
        <div className="mt-auto h-4 w-2/3 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}
