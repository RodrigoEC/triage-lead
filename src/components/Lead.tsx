import { useState } from "react";
import { convertLead, updateLead } from "../api/leads";
import { Icon } from "./Icon";
import { Email } from "./Email";
import type { ILead } from "../util/interfaces";
import { Select } from "./Select";
import { STATUS_OPTIONS } from "../util/constants";

interface LeadProps {
  lead: ILead;
  onUpdate: () => void;
  onRowClick: () => void;
  onLeadConverted: () => void;
}

const ScoreBadge = ({ score }: { score: number }) => {
  let badge;
  if (score >= 850) {
    badge = (
      <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
        Hot
      </span>
    );
  } else if (score >= 650) {
    badge = (
      <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
        High
      </span>
    );
  } else if (score >= 400) {
    badge = (
      <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
        Medium
      </span>
    );
  } else {
    badge = (
      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
        Low
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      {badge}
      <span className="text-gray-500 text-xs">({score})</span>
    </div>
  );
};

export const Lead = ({ lead, onUpdate, onRowClick, onLeadConverted }: LeadProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currLead, setCurrLead] = useState(lead);

  const handleSave = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currLead.email)) {
      alert("Please enter a valid email.");
      return;
    }

    updateLead(currLead.id, {
      email: currLead.email,
      status: currLead.status,
    });
    onUpdate();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrLead(lead);
    setIsEditing(false);
  };

  const handleConvert = (e: React.MouseEvent) => {
    e.stopPropagation();
    convertLead(lead);
    onLeadConverted();
  };

  return (
    <tr className="group bg-white hover:bg-gray-50">
      <td className="shadow-2xl lg:shadow-none box-border sticky left-0 z-10 bg-white px-6 py-4 text-sm text-gray-900 text-start group-hover:bg-gray-50">
        <div className="w-fit flex gap-2 items-center cursor-pointer" onClick={onRowClick}>
          <span className="hover:underline">{currLead.name}</span>
          <Icon id="expand" className="-rotate-90" size={10} />
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-start">{currLead.company}</td>
      <td className="px-6 py-4 text-sm text-start">
        <Email lead={currLead} isEditing={isEditing} onChange={setCurrLead} />
      </td>
      <td className="px-6 py-4 text-sm text-center">
        <Select
          defaultValue={currLead.status}
          isEditing={isEditing}
          options={STATUS_OPTIONS.filter((option) => option !== "converted")}
          onChange={(status: string) =>
            setCurrLead({
              ...currLead,
              status: status,
            } as ILead)
          }
        />
      </td>
      <td className="px-6 py-4 text-sm">
        <ScoreBadge score={currLead.score} />
      </td>
      <td className="flex gap-2 px-6 py-4 text-sm text-right font-medium w-[6rem]">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="cursor-pointer p-2 text-green-700"
              title="Save"
            >
              <Icon id="check" size={18} />
            </button>
            <button
              onClick={handleCancel}
              className="cursor-pointer p-2 text-red-700"
              title="Cancel"
            >
              <Icon id="cancel" size={15} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer p-2"
              title="Edit"
            >
              <Icon id="edit" size={18} />
            </button>
            <button
              onClick={onRowClick}
              className="cursor-pointer p-2"
              title="Edit"
            >
              <Icon id="fullscreen" size={18} />
            </button>
          </>
        )}
      </td>
      <td className="px-6 py-4 text-sm" onClick={handleConvert}>
        <button className="cursor-pointer p-2" title="Convert Lead">
          <Icon id="approved" size={20} />
        </button>
      </td>
    </tr>
  );
};
