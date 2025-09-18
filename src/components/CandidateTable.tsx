import { useEffect, useState, useCallback } from "react";
import { getLeads } from "../api";
import { Candidate } from "./Candidate";
import type { GetLeadsOptions, Lead, SortOptions } from "../util/interfaces";
import { debounce } from "../util";
import { Icon } from "./Icon";
import { TableHead } from "./TableHead";

const DEFAULT_SORT = "none";


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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedGetLeads = useCallback(
    debounce(async (currentFilters: GetLeadsOptions) => {
      setLoading(true);
      setLeads(await getLeads(currentFilters));
      setLoading(false);
    }, 750),
    []
  );

  const handleFilterChange = (field: string, value: string) => {
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
  };

  const handleSortChange = (field: SortOptions) => {
    setSorting(field.toLocaleLowerCase() as SortOptions);
  };

  useEffect(() => {
    const combinedFilters: GetLeadsOptions = {
      ...rootFilter,
      filters: {
        ...rootFilter?.filters,
        ...filters,
      },
    };

    if (sorting !== DEFAULT_SORT) {
      console.log("entering here", sorting)
      combinedFilters.sorting = { score: sorting }
    }

    debouncedGetLeads(combinedFilters);
  }, [filters, rootFilter, debouncedGetLeads, sorting]);
  return (
    <div
      className={`${
        leads.length ? "overflow-x-scroll" : "overflow-x-hidden"
      } w-full rounded-lg box-border`}
    >
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
    </div>
  );
};
