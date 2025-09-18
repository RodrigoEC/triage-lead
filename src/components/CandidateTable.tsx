import { useEffect, useState, useCallback } from "react";
import { getLeads } from "../api";
import { Candidate } from "./Candidate";
import { TABLE_HEADERS } from "../util/constants";
import type { GetLeadsOptions, Lead } from "../util/interfaces";
import { debounce } from "../util";
import { Icon } from "./Icon";

export const TableHead = ({
  pos,
  text,
  onFilterChange,
}: {
  pos: number;
  text: string;
  onFilterChange?: (field: string, value: string) => void;
}) => {
  const isFilterable = ["name", "company", "email"].includes(
    text.toLowerCase()
  );

  return (
    <th
      scope="col"
      className={`${
        pos === 0 &&
        "sticky left-0 bg-green-950 z-10 border-r-1 lg:border-r-0 border-r-green-950"
      } px-6 py-3 text-left text-xs text-gray-400 uppercase`}
    >
      {isFilterable && onFilterChange ? (
        <input
          type="text"
          placeholder={`${text.toLocaleUpperCase()}`}
          onChange={(e) => onFilterChange(text.toLowerCase(), e.target.value)}
          className="w-full min-w-[100px] mt-1 pb-1 border-b-1 placeholder-gray-400"
        />
      ) : (
        text
      )}
    </th>
  );
};

export const CandidateTable = ({
  rootFilter,
}: {
  rootFilter?: GetLeadsOptions;
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<
    Partial<Pick<Lead, "name" | "company" | "email">>
  >({});

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

  useEffect(() => {
    const combinedFilters: GetLeadsOptions = {
      ...rootFilter,
      filters: {
        ...rootFilter?.filters,
        ...filters,
      },
    };
    debouncedGetLeads(combinedFilters);
  }, [filters, rootFilter, debouncedGetLeads]);
  return (
    <div
      className={`${
        leads.length ? "overflow-x-scroll" : "overflow-x-hidden"
      } w-full rounded-lg box-border`}
    >
      <table className="w-full divide-gray-200">
        <thead className="w-full bg-green-950">
          <tr className="w-full">
            {TABLE_HEADERS.map((header, index) => (
              <TableHead
                key={index}
                pos={index}
                text={header}
                onFilterChange={handleFilterChange}
              />
            ))}
          </tr>
        </thead>
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
