import { useState } from "react";
import { updateLead } from "../api";
import { Icon } from "./Icon";
import { Status } from "./Status";
import { Email } from "./Email";
import type { Lead } from "../util/interfaces";

interface CandidateProps {
  lead: Lead;
}

export const Candidate = ({ lead }: CandidateProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currCandidate, setCurrCandidate] = useState(lead);

  const handleSave = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currCandidate.email)) {
      alert("Please enter a valid email.");
      return;
    }

    updateLead(currCandidate.id, {
      email: currCandidate.email,
      status: currCandidate.status,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrCandidate({
      ...lead,
      email: currCandidate.email,
      status: currCandidate.status,
    });
    setIsEditing(false);
  };

  return (
    <tr className="group bg-white hover:bg-gray-50">
      <td className="shadow-2xl lg:shadow-none box-border sticky left-0 z-10 bg-white px-6 py-4 text-sm text-gray-900 text-start group-hover:bg-gray-50">
        {currCandidate.name}
      </td>
      <td className="px-6 py-4 text-sm text-start">{currCandidate.company}</td>
      <td className="px-6 py-4 text-sm text-start">
        <Email
          candidate={currCandidate}
          isEditing={isEditing}
          onChange={setCurrCandidate}
        />
      </td>
      <td className="px-6 py-4 text-sm text-center">
        <Status
          candidate={currCandidate}
          isEditing={isEditing}
          onChange={setCurrCandidate}
        />
      </td>
      <td className="px-6 py-4 text-sm">{currCandidate.score}</td>
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
