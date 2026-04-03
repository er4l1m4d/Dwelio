export default function ListingDetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-10">
      <div className="grid gap-4 md:grid-cols-12">
        <div className="min-h-[420px] rounded-[2rem] bg-surface-container-low md:col-span-8" />
        <div className="grid gap-4 md:col-span-4">
          <div className="min-h-[202px] rounded-[1.75rem] bg-surface-container-low" />
          <div className="min-h-[202px] rounded-[1.75rem] bg-surface-container-low" />
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_360px] xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <div className="grid gap-8">
          <div className="rounded-[2rem] bg-surface-container-low p-8 shadow-[var(--shadow-editorial-card)]">
            <div className="h-4 w-32 rounded-full bg-surface-container-high" />
            <div className="mt-5 h-10 w-3/4 rounded-full bg-surface-container-high" />
            <div className="mt-4 h-5 w-1/2 rounded-full bg-surface-container-high" />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="h-36 rounded-[1.75rem] bg-surface-container-high" />
              <div className="h-36 rounded-[1.75rem] bg-surface-container-high" />
              <div className="h-36 rounded-[1.75rem] bg-surface-container-high" />
              <div className="h-36 rounded-[1.75rem] bg-surface-container-high" />
            </div>
          </div>
          <div className="rounded-[2rem] bg-surface-container-low p-8 shadow-[var(--shadow-editorial-card)]">
            <div className="h-4 w-28 rounded-full bg-surface-container-high" />
            <div className="mt-5 h-8 w-1/2 rounded-full bg-surface-container-high" />
            <div className="mt-6 h-32 rounded-[1.5rem] bg-surface-container-high" />
          </div>
        </div>
        <div className="rounded-[2rem] bg-surface-container-lowest p-7 shadow-[var(--shadow-elevated-panel)]">
          <div className="h-4 w-24 rounded-full bg-surface-container-high" />
          <div className="mt-5 h-12 w-2/3 rounded-full bg-surface-container-high" />
          <div className="mt-8 grid gap-4">
            <div className="h-4 rounded-full bg-surface-container-high" />
            <div className="h-4 rounded-full bg-surface-container-high" />
            <div className="h-4 rounded-full bg-surface-container-high" />
            <div className="h-4 rounded-full bg-surface-container-high" />
          </div>
          <div className="mt-8 h-14 rounded-[1rem] bg-surface-container-high" />
          <div className="mt-3 h-14 rounded-[1rem] bg-surface-container-high" />
          <div className="mt-3 h-14 rounded-[1rem] bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}
