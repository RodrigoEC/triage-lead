import { STATUS_OPTIONS } from "../util/constants";
import type { Lead } from "../util/interfaces";
import { Icon } from "./Icon";

export const Status = ({
  candidate,
  isEditing,
  onChange,
}: {
  candidate: Lead;
  isEditing: boolean;
  onChange: (candidate: Lead) => void;
}) => {
  return isEditing ? (
    <div className="relative">
      <select
        value={candidate.status}
        onChange={(e) =>
          onChange({
            ...candidate,
            status: e.target.value,
          } as Lead)
        }
        className="cursor-pointer hover:bg-gray-200 rounded-lg transition duration-300 p-2 pr-6"
      >
        {STATUS_OPTIONS.filter(option => option !== "Converted").map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <Icon id="expand" size={10} />
      </div>
    </div>
  ) : (
    <span className="p-2 pr-6">{candidate.status}</span>
  );
};
