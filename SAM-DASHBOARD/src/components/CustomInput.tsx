import React from "react";

interface CustomInputProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  sortDirection: "asc" | "desc";
  setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  perPage: number;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  labels?: {
    filter?: string;
    sort?: string;
    sortDirection?: string;
    perPage?: string;
  };
  placeholder?: {
    filter?: string;
    sort?: string;
  };
}

export default function CustomInput({
  filter,
  setFilter,
  sort,
  setSort,
  sortDirection,
  setSortDirection,
  perPage,
  setPerPage,
  labels = {
    filter: "Filter",
    sort: "sort",
    sortDirection: "Sort Direction",
    perPage: "Per Page",
  },
  placeholder = {
    filter: "Cari...",
    sort: "Urutkan Berdasarkan...",
  },
}: CustomInputProps) {
  const handleClear = () => {
    setFilter("");
    setSort("");
    setSortDirection("asc");
    setPerPage(10);
  };

  return (
    <div className="bg-gray-300 rounded-sm p-3">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-4 text-black">
          <h3 className="w-20 mr-8">{labels.filter}</h3>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={placeholder.filter}
            className="bg-white rounded-sm flex-1 px-2 py-1"
          />
          <button
            className="btn btn-sm px-3 py-1 rounded-sm"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <div className="flex items-center gap-4">
          <h3 className="w-20">{labels.sort}</h3>
          <input
            type="text"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            placeholder={placeholder.sort}
            className="bg-white rounded-sm flex-1 px-2 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 pt-5">
        <div className="flex items-center gap-4 text-black">
          <h3 className="w-28">{labels.sortDirection}</h3>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
            className="select select-bordered bg-white rounded-sm flex-1 "
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <h3 className="w-20">{labels.perPage}</h3>
          <input
            type="number"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="bg-white rounded-sm flex-1 px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
}
