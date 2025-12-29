import { Skeleton } from "./ui/skeleton";

// function LoadingCard({ count = 15 }: LoadingCardProps) This is a default value.

interface LoadingCardProps {
  count?: number;
}

export default function LoadingCard({ count = 15 }: LoadingCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="w-full aspect-5/2 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

