import React from "react";

export default function Pagination({ currentPage, totalPage, onPageChange }) {
  const goToFirst = () => onPageChange(1);
  const goToPrev = () => onPageChange(currentPage > 1 ? currentPage - 1 : 1);
  const goToNext = () =>
    onPageChange(currentPage < totalPage ? currentPage + 1 : totalPage);
  const goToLast = () => onPageChange(totalPage);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={goToFirst}
        // disabled={currentPage === 1}
        className="btn btn-sm btn-outline"
      >
        « First
      </button>
      <button
        onClick={goToPrev}
        // disabled={currentPage === 1}
        className="btn btn-sm btn-outline"
      >
        ‹ Prev
      </button>
      <button className="btn btn-sm btn-active">{currentPage}</button>
      <button
        onClick={goToNext}
        // disabled={currentPage === totalPage}
        className="btn btn-sm btn-outline"
      >
        Next ›
      </button>
      <button
        onClick={goToLast}
        // disabled={currentPage === totalPage}
        className="btn btn-sm btn-outline"
      >
        Last »
      </button>
    </div>
  );
}
