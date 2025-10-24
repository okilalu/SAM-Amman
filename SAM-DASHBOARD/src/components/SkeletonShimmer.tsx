import React from "react";
import clsx from "clsx";

interface SkeletonShimmerProps {
  className?: string;
}

export const SkeletonShimmer: React.FC<SkeletonShimmerProps> = ({
  className,
}) => {
  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-gray-100 dark:bg-gray-200",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.5s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent",
        className
      )}
    />
  );
};
