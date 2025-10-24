import React from "react";
import { SkeletonShimmer } from "./SkeletonShimmer";

type LoadingVariant = "dashboard" | "table" | "form" | "chart";
type LoadingContent =
  | "home"
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
  headerLines?: number;
  contents?: LoadingContent;
}

export const CustomMainLoading: React.FC<CustomMainLoadingProps> = ({
  variant = "dashboard",
  contentLines = 6,
  contents = "home",
  menuLines = 4,
  headerLines = 5,
}) => {
  if (variant === "table") {
    return (
      <div
        className={`space-y-1 ${
          contents === "user" || contents === "email" ? "pt-5" : ""
        }`}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${headerLines}, minmax(0, 1fr))`,
          }}
        >
          {[...Array(headerLines)].map((_, i) => (
            <SkeletonShimmer
              key={`head-${i}`}
              className="h-10 w-full rounded bg-gray-200 dark:bg-gray-300"
            />
          ))}
        </div>

        <div className="space-y-2">
          {[...Array(menuLines)].map((_, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${headerLines}, minmax(0, 1fr))`,
              }}
            >
              {[...Array(headerLines)].map((_, colIdx) => (
                <SkeletonShimmer
                  key={`cell-${rowIdx}-${colIdx}`}
                  className="h-10 w-full rounded"
                />
              ))}
            </div>
          ))}
        </div>
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
    <div
      className={`p-4 flex flex-col ${
        contents === "home" ? "gap-10" : "gap-4"
      }`}
    >
      <div className="grid grid-cols-4 gap-3">
        {[...Array(menuLines)].map((_, i) => (
          <SkeletonShimmer
            key={i}
            className={`${contents === "home" ? "h-32" : "h-10"} w-full ${
              i === 4 ? "col-start-2" : ""
            }`}
          />
        ))}
      </div>

      <div className={`flex-1 grid grid-cols-1 gap-4`}>
        {[...Array(contentLines)].map((_, i) => (
          <SkeletonShimmer
            key={i}
            className={`${contents === "home" ? "h-72" : "h-32"} w-full`}
          />
        ))}
      </div>
    </div>
  );
};
