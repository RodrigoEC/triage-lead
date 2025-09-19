import { useEffect, useState, useCallback } from "react";
import { getLeads } from "../api";
import { Candidate } from "./Candidate";
import type { GetLeadsOptions, Lead, SortOptions } from "../util/interfaces";
import { Icon } from "./Icon";
import { TableHead } from "./TableHead";
import { DEFAULT_SORT, LEADS_PER_PAGE } from "../util/constants";

export const CandidateTable = ({
  rootFilter,
}: {
  rootFilter?: GetLeadsOptions;
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<
    Partial<Pick<Lead, "name" | "company" | "email" | "status">>
  >({});
  const [sorting, setSorting] = useState<SortOptions>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const handleFilterChange = useCallback(
    (field: string, value: string) => {
      setPage(1);
      if (!value) {
        value =
          (rootFilter?.filters?.[
            field as keyof typeof rootFilter.filters
          ] as string) || "";
      }

      setFilters((prevFilters) => ({
        ...prevFilters,
        [field]: value,
      }));
    },
    [rootFilter]
  );

  const handleSortChange = (field: SortOptions) => {
    setPage(1);
    setSorting(field.toLocaleLowerCase() as SortOptions);
  };

  const totalPages = Math.ceil(totalLeads / LEADS_PER_PAGE);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    const combinedFilters: GetLeadsOptions = {
      ...rootFilter,
      filters: {
        ...rootFilter?.filters,
        ...filters,
      },
      pagination: {
        page,
        limit: LEADS_PER_PAGE,
      },
    };

    if (sorting !== DEFAULT_SORT) {
      combinedFilters.sorting = { score: sorting };
    }

    const fetchLeads = async () => {
      setLoading(true);
      const { leads: newLeads, total } = await getLeads(combinedFilters);
      setLeads(newLeads);
      setTotalLeads(total);
      setLoading(false);
    };
    fetchLeads();
  }, [filters, rootFilter, sorting, page]);

  return (
    <div className={`w-full rounded-lg box-border overflow-hidden`}>
      <div className="w-full overflow-scroll ">
        <table className="w-full divide-gray-200">
          <TableHead
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
          {!loading && (
            <tbody className="w-full divide-y divide-gray-700">
              {leads.map((lead) => (
                <Candidate key={lead.id} lead={lead} />
              ))}
            </tbody>
          )}
        </table>
      </div>

      {loading && (
        <div className="w-full h-52 flex flex-col items-center justify-center border-1 border-gray-200 rounded-b-lg text-gray-400">
          <Icon id="loading" size={40} className="animate-spin" />
          <p className="mt-4 uppercase text-sm">Loading...</p>
        </div>
      )}
      {!loading && !leads.length && (
        <div className="w-full h-52 flex flex-col items-center justify-center border-1 border-gray-200 rounded-b-lg text-gray-400">
          <p>No Lead Found</p>
        </div>
      )}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
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
                  {(page - 1) * LEADS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(page * LEADS_PER_PAGE, totalLeads)}
                </span>{" "}
                of <span className="font-medium">{totalLeads}</span> results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <Icon id="expand" size={12} className="rotate-90" />
                </button>
                <span
                  aria-current="page"
                  className="relative z-10 inline-flex items-center bg-green-950 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  {page}
                </span>
                <button
                  onClick={handleNextPage}
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
      )}
    </div>
  );
};
