import React from "react";
import { SkeletonShimmer } from "./SkeletonShimmer";

type LoadingVariant = "dashboard" | "table" | "form" | "chart";
type LoadingContent =
  | "dashboard"
  | "device"
  | "user"
  | "portable"
  | "location"
  | "email"
  | "log"
  | "control";
interface CustomMainLoadingProps {
  variant?: LoadingVariant;
  menuLines?: number;
  contentLines?: number;
  contents?: LoadingContent;
}

export const CustomMainLoading: React.FC<CustomMainLoadingProps> = ({
  variant = "dashboard",
  contentLines = 6,
  contents,
  menuLines = 5,
}) => {
  const shimmerClass =
    "relative overflow-hidden bg-gray-300 rounded dark:bg-gray-400 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent";

  if (variant === "table") {
    return (
      <div className="space-y-3 p-4">
        <div className={`${shimmerClass} h-6 w-1/3`}></div>
        {[...Array(menuLines)].map((_, i) => (
          <SkeletonShimmer key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className="space-y-4 p-4">
        {[...Array(menuLines)].map((_, i) => (
          <SkeletonShimmer key={i} className="h-12 w-full" />
        ))}
        <SkeletonShimmer className="h-12 w-1/3" />
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className="rounded-lg space-y-4 bg-white">
        <div className="flex justify-between items-center">
          <SkeletonShimmer className="h-10 w-1/3 rounded" />
          <SkeletonShimmer className="h-10 w-24 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <SkeletonShimmer className="h-10 w-1/4 rounded" />
          <div className="flex items-center">
            <SkeletonShimmer className="h-10 w-18 rounded" />
            <SkeletonShimmer className="h-10 w-18 rounded" />
            <SkeletonShimmer className="h-10 w-18 rounded" />
          </div>
        </div>

        <SkeletonShimmer className="h-64 w-full rounded-md" />

        {/* <div className="flex gap-3 pt-2">
          {[...Array(3)].map((_, i) => (
            <SkeletonShimmer key={i} className="h-4 w-20 rounded" />
          ))}
        </div> */}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {[...Array(menuLines)].map((_, i) => (
          <SkeletonShimmer
            key={i}
            className={`h-10 w-full ${i === 4 ? "col-start-2" : ""}`}
          />
        ))}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {[...Array(contentLines)].map((_, i) => (
          <SkeletonShimmer key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
};
