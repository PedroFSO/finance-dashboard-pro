import { Skeleton } from './Skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <section className="surface-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-12 w-72 max-w-full" />
            <Skeleton className="h-4 w-120 max-w-full" />
          </div>
          <div className="grid w-full max-w-xl grid-cols-2 gap-3">
            <Skeleton className="h-22 w-full" />
            <Skeleton className="h-22 w-full" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="surface-card p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-36" />
              </div>
              <Skeleton className="size-12 rounded-2xl" />
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,1fr)]">
        <div className="surface-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
          <Skeleton className="h-80 w-full rounded-[26px]" />
        </div>

        <div className="surface-card p-6">
          <div className="mb-6 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_180px]">
            <Skeleton className="h-72 w-full rounded-[26px]" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card p-6">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid w-full gap-3 md:grid-cols-3 lg:max-w-2xl">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-18 w-full rounded-[22px]" />
          ))}
        </div>
      </section>
    </div>
  )
}
