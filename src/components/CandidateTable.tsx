import { useEffect, useState, useCallback } from "react";
import { getLeads } from "../api";
import { Candidate } from "./Candidate";
import { TABLE_HEADERS } from "../util/constants";
import type { GetLeadsOptions, Lead } from "../util/interfaces";
import { debounce } from "../util";

export const TableHead = ({
  text,
  onFilterChange,
}: {
  text: string;
  onFilterChange?: (field: string, value: string) => void;
}) => {
  const isFilterable = ["name", "company", "email"].includes(text);

  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs text-gray-400 uppercase"
    >
      {isFilterable && onFilterChange ? (
        <input
          type="text"
          placeholder={`${text.toLocaleUpperCase()}`}
          onChange={(e) => onFilterChange(text.toLowerCase(), e.target.value)}
          className="w-full mt-1 pb-1 border-b-1"
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
  const [filters, setFilters] = useState<
    Partial<Pick<Lead, "name" | "company" | "email">>
  >({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedGetLeads = useCallback(
    debounce(async (currentFilters: GetLeadsOptions) => {
      setLeads(await getLeads(currentFilters));
    }, 300),
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
    <table className="w-full divide-gray-200">
      <thead className="w-full bg-gray-50 dark:bg-gray-800">
        <tr className="w-full">
          {TABLE_HEADERS.map((header) => (
            <TableHead
              key={header}
              text={header}
              onFilterChange={handleFilterChange}
            />
          ))}
        </tr>
      </thead>
      <tbody className="w-full bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {leads.map((lead) => (
          <Candidate key={lead.id} lead={lead} />
        ))}
      </tbody>
    </table>
  );
};
