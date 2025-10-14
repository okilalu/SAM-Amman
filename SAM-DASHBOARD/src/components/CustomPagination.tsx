import React from "react";
import {
  HiChevronRight,
  HiChevronLeft,
  HiChevronDoubleRight,
  HiChevronDoubleLeft,
} from "react-icons/hi2";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (i: number) => void;
}

export const CustomPagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPagesToShow = 5;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const buttonClass =
    "pagination-button bg-slate-100 text-custom-green-1 rounded-md p-1.5";
  const disabledClass =
    "rounded-md p-1.5 bg-slate-300 text-custom-green-2 opacity-30 cursor-not-allowed";

  return (
    <div className="pagination flex justify-center items-center gap-2 bottom-0">
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`${currentPage === 1 ? disabledClass : buttonClass}`}
        >
          <HiChevronDoubleLeft size={15} />
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`${currentPage === 1 ? disabledClass : buttonClass}`}
        >
          <HiChevronLeft size={15} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {getPaginationNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              className={`current-page w-[25px] h-[25px] rounded-md text-xs ${
                page === currentPage
                  ? "bg-custom-green-1 bg-[#bde1e4] text-black"
                  : "bg-white text-black border border-slate-300"
              }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={index}
              className="current-page p-2 rounded-md bg-white w-[25px] h-[25px] border border-slate-300 flex justify-center items-center text-xs"
            >
              {page}
            </span>
          )
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? disabledClass : buttonClass
          }`}
        >
          <HiChevronRight size={15} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? disabledClass : buttonClass
          }`}
        >
          <HiChevronDoubleRight size={15} />
        </button>
      </div>
    </div>
  );
};
