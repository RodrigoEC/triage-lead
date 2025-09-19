import {
  DEFAULT_STATUS,
  STATUS_OPTIONS,
} from "../util/constants";
import type { SortOptions } from "../util/interfaces";
import { Input } from "./Input";
import { Select } from "./Select";
import { Icon } from "./Icon";

export const LeadTableHead = ({
  onFilterChange,
  onSortChange,
  filters,
  sorting,
}: {
  onFilterChange: (field: string, value: string) => void;
  onSortChange: (field: SortOptions) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: Record<string, any>;
  sorting: SortOptions;
}) => {
  const handleSort = () => {
    let newSort: SortOptions;
    if (sorting === "unsorted") newSort = "desc";
    else if (sorting === "desc") newSort = "asc";
    else newSort = "unsorted";
    onSortChange(newSort);
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
        >
          Name
          <Input text="name" onChange={onFilterChange} defaultValue={filters.name || ""} />
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
        >
          Company
          <Input text="company" onChange={onFilterChange} defaultValue={filters.company || ""} />
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
        >
          Email
          <Input text="email" onChange={onFilterChange} defaultValue={filters.email || ""} />
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
        >
          Status
          <Select
            defaultValue={filters.status || DEFAULT_STATUS}
            options={[...STATUS_OPTIONS, DEFAULT_STATUS]
              .filter((option) => option !== "converted")
              .map((option) => option)}
            onChange={(val: string) =>
              onFilterChange(
                "status",
                val !== DEFAULT_STATUS ? val.toLocaleLowerCase() : ""
              )
            }
          />
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
        >
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={handleSort}
          >
            Score
            <Icon
              id="expand"
              size={12}
              className={`transition-transform ${
                sorting === "desc"
                  ? "rotate-0"
                  : sorting === "asc"
                  ? "rotate-180"
                  : "rotate-90"
              }`}
            />
          </div>
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
        >
          Actions
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
        >
          CONVERT LEAD
        </th>
      </tr>
    </thead>
  );
};
