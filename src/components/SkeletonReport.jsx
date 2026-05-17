import { Skeleton } from "./ui/skeleton";

export default function SkeletonReport() {
  return (
    <div className="w-full flex flex-col gap-8 py-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full bg-card/50" />
        ))}
      </div>
      
      <div className="flex justify-center my-4">
        <Skeleton className="h-40 w-40 rounded-full bg-card/50" />
      </div>

      <Skeleton className="h-[400px] w-full rounded-xl bg-card/50" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] w-full rounded-xl bg-card/50" />
        <Skeleton className="h-[400px] w-full rounded-xl bg-card/50" />
      </div>
    </div>
  );
}