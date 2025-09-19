import { useState, type ReactElement } from "react";
import { DEFAULT_SORT, DEFAULT_STATUS, SORT_OPTIONS, STATUS_OPTIONS } from "../util/constants";
import type { SortOptions } from "../util/interfaces";
import { Input } from "./Input";
import { Select } from "./Select";

export const TableHead = ({
  onFilterChange,
  onSortChange,
}: {
  onFilterChange: (field: string, value: string) => void;
  onSortChange: (field: SortOptions) => void;
}) => {
  const [sort, setSort] = useState<SortOptions>(DEFAULT_SORT);

  const handleSort = () => {
    let newSort: SortOptions;
    if (sort === "unsorted") newSort = "desc";
    else if (sort === "desc") newSort = "asc";
    else newSort = "unsorted";
    setSort(newSort);
    onSortChange(newSort);
  };
  const TABLE_HEADERS: { [key: string]: { component?: () => ReactElement } } = {
    name: { component: () => <Input text={"name"} onChange={onFilterChange} /> },
    company: {
      component: () => <Input text={"company"} onChange={onFilterChange} />,
    },
    email: { component: () => <Input text={"email"} onChange={onFilterChange} /> },
    status: {
      component: () => (
        <Select
          defaultValue={DEFAULT_STATUS}
          options={[...STATUS_OPTIONS, DEFAULT_STATUS]
            .filter((option) => option !== "converted")
            .map((option) => option)}
          onChange={(val: string) =>
            onFilterChange("status", val !== DEFAULT_STATUS ? val.toLocaleLowerCase() : "")
          }
        />
      ),
    },
    score: {
      component: () => (
        <Select
          defaultValue={DEFAULT_SORT}
          options={SORT_OPTIONS.map((option) => option)}
          onChange={(val) => onSortChange(val.toLocaleLowerCase() as SortOptions)}
        />
      ),
    },
    action: {},
    "convert lead": {},
  };

  return (
    <thead className="w-full bg-green-950">
      <tr className="w-full">
        {Object.entries(TABLE_HEADERS).map(([key, data], index) => {
          return (
            <th
              scope="col"
              className={`${
                index === 0 &&
                "sticky left-0 bg-green-950 z-10 border-r-1 lg:border-r-0 border-r-green-950"
              } px-6 py-3 text-left text-xs text-gray-400 uppercase`}
            >
              <span className="text-white text-[10px]">{key}</span>

              {data.component && data.component()}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
