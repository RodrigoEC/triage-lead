import { useState } from "react";
import { updateLead } from "../api";
import { Icon } from "./Icon";
import { Email } from "./Email";
import type { ILead } from "../util/interfaces";
import { Select } from "./Select";
import { STATUS_OPTIONS } from "../util/constants";

interface LeadProps {
  lead: ILead;
}

export const Lead = ({ lead }: LeadProps) => {
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
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrLead({
      ...lead,
      email: currLead.email,
      status: currLead.status,
    });
    setIsEditing(false);
  };

  return (
    <tr className="group bg-white hover:bg-gray-50">
      <td className="shadow-2xl lg:shadow-none box-border sticky left-0 z-10 bg-white px-6 py-4 text-sm text-gray-900 text-start group-hover:bg-gray-50">
        {currLead.name}
      </td>
      <td className="px-6 py-4 text-sm text-start">{currLead.company}</td>
      <td className="px-6 py-4 text-sm text-start">
        <Email
          lead={currLead}
          isEditing={isEditing}
          onChange={setCurrLead}
        />
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
      <td className="px-6 py-4 text-sm">{currLead.score}</td>
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
          </>
        )}
      </td>
      <td className="px-6 py-4 text-sm">
        <button className="cursor-pointer p-2">
          <Icon id="approved" size={20} />
        </button>
      </td>
    </tr>
  );
};
