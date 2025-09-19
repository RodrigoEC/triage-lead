import { useEffect, useState, useCallback } from "react";
import { getLeads } from "../api";
import type { GetLeadsOptions, ILead, SortOptions } from "../util/interfaces";
import { Icon } from "./Icon";
import { TableHead } from "./TableHead";
import { DEFAULT_SORT, LEADS_PER_PAGE } from "../util/constants";
import { TableNav } from "./TableNav";
import { Lead } from "./Lead";

export const LeadTable = ({
  rootFilter,
}: {
  rootFilter?: GetLeadsOptions;
}) => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [page, setPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [sorting, setSorting] = useState<SortOptions>(DEFAULT_SORT);

  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState<
    Partial<Pick<ILead, "name" | "company" | "email" | "status">>
  >({});

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
                <Lead key={lead.id} lead={lead} />
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
        <TableNav
          page={page}
          totalPages={totalPages}
          totalLeads={totalLeads}
          leadsPerPage={LEADS_PER_PAGE}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      )}
    </div>
  );
};
