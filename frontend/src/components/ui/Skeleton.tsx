export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface-border/60 ${className}`} />;
}

export function CardSkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-surface-border bg-surface-raised p-4">
          <Skeleton className="mb-3 h-5 w-5" />
          <Skeleton className="mb-2 h-3 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
      ))}
    </div>
  );
}

export function RowSkeletonList({ rows, columns = 3 }: { rows: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-surface-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-6 border-b border-surface-border px-4 py-3 last:border-0"
        >
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className={`h-3.5 ${j === 0 ? 'w-40' : 'w-20'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
