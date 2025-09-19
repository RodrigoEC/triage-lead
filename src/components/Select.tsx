import { Icon } from "./Icon";

export const Select = ({
  defaultValue,
  isEditing = true,
  onChange,
  options,
}: {
  defaultValue: string;
  isEditing?: boolean;
  onChange: (status: string) => void;
  options: string[];
}) => {
  return isEditing ? (
    <div className="relative text-start min-w-[100px]">
      <select
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="capitalize w-full  cursor-pointer pr-6 mt-1 pb-1 border-b-1 border-grey-100"
      >
        {options.map(
          (option) => (
            <option className="capitalize" value={option} key={option}>{option}</option>
          )
        )}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <Icon id="expand" size={10} />
      </div>
    </div>
  ) : (
    <p className="text-start capitalize">{defaultValue}</p>
  );
};
