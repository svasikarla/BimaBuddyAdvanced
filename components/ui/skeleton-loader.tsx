import { Skeleton } from "@/components/ui/skeleton"

export function PolicyCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export function ChatMessageSkeleton() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-muted rounded-lg p-4 max-w-[80%] space-y-2">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-3 w-56" />
      </div>
    </div>
  )
}

export function PlanRecommendationSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <Skeleton className="h-12 w-full mt-4" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}

export function PolicyDetailSkeleton() {
  return (
    <div className="container px-4 md:px-6 py-8 space-y-8">
      {/* Header section */}
      <div className="bg-white border rounded-lg p-8 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-10 w-2/3" /> {/* Policy name */}
            <Skeleton className="h-5 w-1/3" /> {/* Provider */}
          </div>
          <Skeleton className="h-12 w-32" /> {/* CTA button */}
        </div>
        <div className="flex gap-4 mt-6">
          <Skeleton className="h-20 w-32 rounded-lg" /> {/* Premium card */}
          <Skeleton className="h-20 w-32 rounded-lg" /> {/* Coverage card */}
          <Skeleton className="h-20 w-32 rounded-lg" /> {/* Rating card */}
        </div>
      </div>

      {/* Key features section */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <Skeleton className="h-7 w-48" /> {/* Section title */}
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" /> {/* Icon */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage details section */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <Skeleton className="h-7 w-56" /> {/* Section title */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table skeleton */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <Skeleton className="h-7 w-64" /> {/* Section title */}
        <TableSkeleton rows={4} />
      </div>
    </div>
  )
}
