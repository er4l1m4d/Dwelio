export default function PropertyCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[var(--shadow-elevated-panel)]">
      <div className="relative aspect-[4/5] bg-surface-container">
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div className="h-7 w-20 rounded-full bg-surface-container-high" />
          <div className="h-7 w-24 rounded-full bg-surface-container-high" />
        </div>
        <div className="absolute bottom-4 left-4 h-7 w-28 rounded-full bg-surface-container-high" />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="h-7 w-4/5 rounded-full bg-surface-container" />
            <div className="mt-3 h-4 w-full rounded-full bg-surface-container" />
            <div className="mt-2 h-4 w-5/6 rounded-full bg-surface-container" />
          </div>
          <div className="w-24 shrink-0">
            <div className="h-7 w-full rounded-full bg-surface-container" />
            <div className="mt-2 h-3 w-16 rounded-full bg-surface-container" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-24 rounded-full bg-surface-container-low" />
          <div className="h-10 w-24 rounded-full bg-surface-container-low" />
          <div className="h-10 w-24 rounded-full bg-surface-container-low" />
        </div>
      </div>
    </div>
  );
}
