export default function ListingDetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-8">
      <div className="h-[360px] w-full rounded-3xl bg-emerald-50" />
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8">
          <div className="h-4 w-24 rounded-full bg-slate-200" />
          <div className="mt-4 h-6 w-2/3 rounded-full bg-slate-200" />
          <div className="mt-3 h-4 w-1/2 rounded-full bg-slate-200" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="h-20 rounded-2xl bg-slate-200" />
            <div className="h-20 rounded-2xl bg-slate-200" />
          </div>
          <div className="mt-6 h-24 rounded-2xl bg-slate-200" />
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6">
          <div className="h-4 w-24 rounded-full bg-slate-200" />
          <div className="mt-4 h-12 rounded-2xl bg-slate-200" />
          <div className="mt-6 h-12 rounded-full bg-slate-200" />
          <div className="mt-3 h-12 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
