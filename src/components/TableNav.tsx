import { Icon } from "./Icon";

interface TableNavProps {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange: (page: number) => void;
}

export const TableNav = ({
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onNextPage,
  onPrevPage,
  onPageChange,
}: TableNavProps) => {
  const getPaginationItems = (
    currentPage: number,
    totalPages: number,
  ): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const paginationItems = getPaginationItems(page, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={onPrevPage}
          disabled={page === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={onNextPage}
          disabled={page === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
                {(page - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
                {Math.min(page * itemsPerPage, totalItems)}
            </span>{" "}
              of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={onPrevPage}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <Icon id="expand" size={12} className="rotate-90" />
            </button>
            {paginationItems.map((item, index) => {
              if (item === "...") {
                return (
                  <span
                    key={`${item}-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                  >
                    ...
                  </span>
                );
              }
              const isCurrent = item === page;
              return (
                <button
                  key={item}
                  onClick={() => onPageChange(item)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${isCurrent ? "z-10 bg-green-950 text-white focus-visible:outline-green-600" : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"} focus:z-20`}
                >
                  {item}
                </button>
              );
            })}
            <button
              onClick={onNextPage}
              disabled={page === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <Icon id="expand" size={12} className="-rotate-90" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
