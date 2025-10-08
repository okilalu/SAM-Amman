import React from "react";

interface CustomFilterProps {
  filterLabel?: string;
  sortLabel?: string;
  placeholder?: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  sortDirection: "asc" | "desc";
  setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
}

export default function CustomFilter({
  filterLabel = "Filter",
  sortLabel = "SOrt Direction",
  placeholder = "Masukkan kata kunci",
  filter,
  setFilter,
  sortDirection,
  setSortDirection,
}: CustomFilterProps) {
  return (
    <div className="bg-white p-6 mb-6 rounded-xl">
      <div className="flex items-center justify-center shadow-2xs p-1 rounded-sm mb-6 ">
        <h2 className="text-gray-700  text-xl font-semibold ">Filter & Sort</h2>
      </div>
      <div className="">
        <div className="flex justify-between gap-6 mb-3 font-semibold">
          <label className="py-3 font-semibold text-gray-700 w-24">
            {filterLabel}
          </label>
          <input
            type="text"
            placeholder={placeholder}
            className="py-3 input bg-gray-200 input-bordered w-full max-w-xs"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex justify-between gap-6 mb-3 font-semibold">
          <label className="py-3 font-semibold text-gray-700 w-24">
            {sortLabel}
          </label>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
            className="py-3 select bg-gray-200 select-bordered w-full max-w-xs"
          >
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
