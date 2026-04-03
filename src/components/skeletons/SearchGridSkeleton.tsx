import PropertyCardSkeleton from "@/components/skeletons/PropertyCardSkeleton";

export default function SearchGridSkeleton() {
  return (
    <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="order-2 xl:order-1">
        <div className="animate-pulse rounded-[2rem] bg-surface-container-low p-6 shadow-[var(--shadow-editorial-card)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="h-4 w-24 rounded-full bg-surface-container-high" />
              <div className="mt-4 h-8 w-28 rounded-full bg-surface-container-high" />
            </div>
            <div className="h-9 w-24 rounded-full bg-surface-container-high" />
          </div>

          <div className="mt-6 grid gap-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid gap-2">
                <div className="h-3 w-24 rounded-full bg-surface-container-high" />
                <div className="h-12 rounded-[1rem] bg-surface-container-lowest" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="order-1 grid gap-6 xl:order-2">
        <div className="animate-pulse rounded-[2rem] bg-surface-container-low p-6 shadow-[var(--shadow-editorial-card)] md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="h-4 w-24 rounded-full bg-surface-container-high" />
              <div className="mt-4 h-12 w-full max-w-2xl rounded-full bg-surface-container-high" />
              <div className="mt-4 h-5 w-full max-w-xl rounded-full bg-surface-container-high" />
              <div className="mt-2 h-5 w-5/6 max-w-lg rounded-full bg-surface-container-high" />
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <div className="h-10 w-28 rounded-full bg-surface-container-lowest" />
              <div className="h-10 w-32 rounded-full bg-surface-container-lowest" />
              <div className="h-12 w-full rounded-full bg-surface-container-lowest sm:w-52" />
            </div>
          </div>

          <div className="mt-8 flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-10 w-28 shrink-0 rounded-full bg-surface-container-lowest"
              />
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
