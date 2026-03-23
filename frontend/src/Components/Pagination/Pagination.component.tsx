import React from "react";
import type { PaginationMeta } from "../../config/pagination";

type Props = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
};

/** Page numbers with gaps when there are many pages (e.g. 1 … 4 5 6 … 20). */
function buildPageNumbers(current: number, total: number): (number | "gap")[] {
  if (total <= 9) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const set = new Set<number>();
  set.add(1);
  set.add(total);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= total) set.add(p);
  }
  const sorted = Array.from(set).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  }
  return out;
}

const Pagination: React.FC<Props> = ({
  pagination,
  onPageChange,
  className = "",
  disabled = false,
}) => {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1 || total === 0) {
    return null;
  }

  const items = buildPageNumbers(page, totalPages);
  const btnBase =
    "min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const inactive =
    "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300";
  const active =
    "bg-gradient-to-r from-sky-500 to-violet-600 text-white border border-transparent shadow-sm";

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-2 py-6 ${className}`}
      aria-label="Page navigation"
    >
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`${btnBase} ${inactive}`}
      >
        Previous
      </button>

      {items.map((item, idx) =>
        item === "gap" ? (
          <span
            key={`gap-${idx}`}
            className="px-1 text-gray-400 select-none"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            disabled={disabled}
            onClick={() => onPageChange(item)}
            className={`${btnBase} ${item === page ? active : inactive}`}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${btnBase} ${inactive}`}
      >
        Next
      </button>

      <span className="w-full sm:w-auto text-center sm:text-left text-sm text-gray-500 sm:ml-3">
        Page {page} of {totalPages} · {total} post{total !== 1 ? "s" : ""}
      </span>
    </nav>
  );
};

export default Pagination;
