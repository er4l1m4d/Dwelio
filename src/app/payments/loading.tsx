export default function LoadingPayments() {
  return (
    <div className="min-h-screen bg-surface px-6 py-10 md:px-8">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 lg:grid-cols-12">
        <div className="animate-pulse space-y-8 lg:col-span-7">
          <div className="h-6 w-40 rounded-full bg-surface-container" />
          <div className="h-14 w-4/5 rounded-[1.5rem] bg-surface-container-low" />
          <div className="rounded-[2rem] bg-surface-container-low p-8">
            <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="aspect-[4/3] rounded-[1.5rem] bg-surface-container" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 rounded-full bg-surface-container" />
                <div className="h-5 w-2/3 rounded-full bg-surface-container" />
                <div className="flex gap-3">
                  <div className="h-10 w-28 rounded-full bg-surface-container" />
                  <div className="h-10 w-28 rounded-full bg-surface-container" />
                </div>
                <div className="h-20 rounded-[1.25rem] bg-surface-container" />
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-surface-container-low p-8">
            <div className="h-8 w-60 rounded-full bg-surface-container" />
            <div className="mt-6 h-72 rounded-[1.5rem] bg-surface-container" />
          </div>
        </div>

        <div className="animate-pulse space-y-6 lg:col-span-5">
          <div className="rounded-[2rem] bg-primary-container/90 p-8">
            <div className="h-8 w-40 rounded-full bg-white/15" />
            <div className="mt-8 space-y-4">
              <div className="h-5 rounded-full bg-white/10" />
              <div className="h-5 rounded-full bg-white/10" />
              <div className="h-5 rounded-full bg-white/10" />
              <div className="h-20 rounded-[1.5rem] bg-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-36 rounded-[1.5rem] bg-surface-container-low" />
            <div className="h-36 rounded-[1.5rem] bg-surface-container-low" />
            <div className="h-36 rounded-[1.5rem] bg-surface-container-low" />
            <div className="h-36 rounded-[1.5rem] bg-surface-container-low" />
          </div>
        </div>
      </div>
    </div>
  );
}
