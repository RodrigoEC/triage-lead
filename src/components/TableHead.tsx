import { STATUS_OPTIONS, TABLE_HEADERS } from "../util/constants";
import { Icon } from "./Icon";
import { Input } from "./Input";

export const TableHead = ({
  onFilterChange,
}: {
  onFilterChange: (field: string, value: string) => void;
}) => {
  return (
    <thead className="w-full bg-green-950">
      <tr className="w-full">
        {Object.entries(TABLE_HEADERS).map(([key, value], index) => {
          return (
            <th
              scope="col"
              className={`${
                index === 0 &&
                "sticky left-0 bg-green-950 z-10 border-r-1 lg:border-r-0 border-r-green-950"
              } px-6 py-3 text-left text-xs text-gray-400 uppercase`}
            > 
              <span className="text-white text-[10px]">{key}</span>
              {(value as { search?: boolean })?.search && (
                <Input text={key} onChange={onFilterChange} key={index} />
              )}
              {(value as { filter?: boolean })?.filter && (
                <div className="relative">
                  <select
                    defaultValue=""
                    onChange={(e) => onFilterChange("status", e.target.value)}
                    className="w-full cursor-pointer hover:bg-green-950 transition duration-300 pt-2 pb-1 pr-6 border-b-1 border-grey-100"
                  >
                    {[...STATUS_OPTIONS, "all"]
                      .filter((option) => option !== "Converted")
                      .map((option) => (
                        <option
                          key={option}
                          value={option !== "all" ? option : ""}
                        >
                          {option.toLocaleUpperCase()}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-grey-200">
                    <Icon id="expand" size={10} />
                  </div>
                </div>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
