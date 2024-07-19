import React from "react";
import { Skeleton } from "./ui/skeleton";

export default function SkeletFiles() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <Skeleton className="aspect-square rounded-xl" />
      <Skeleton className="aspect-square rounded-xl" />
      <Skeleton className="aspect-square rounded-xl" />
      <Skeleton className="aspect-square rounded-xl" />
    </div>
  );
}
