import { useState } from "react";
import { updateLead, type Lead } from "../api";
import { Icon } from "./Icon";
import { STATUS_OPTIONS } from "../util/constants";

interface CandidateProps {
  lead: Lead;
}

export const Candidate = ({ lead }: CandidateProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [{ id, name, company, email, status, score }, setCurrentCandidate] =
    useState(lead);

  const handleSave = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    updateLead(id, {
      email: email,
      status: status,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentCandidate({
      ...lead,
      email: email,
      status: status,
    });
    setIsEditing(false);
  };

  return (
    <tr className="bg-white hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900 text-start">{name}</td>
      <td className="px-6 py-4 text-sm text-start">{company}</td>
      <td className="px-6 py-4 text-sm text-start">
        {isEditing ? (
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setCurrentCandidate({
                ...{ id, name, company, status, score },
                email: e.target.value,
              } as Lead)
            }
            className="block w-full border-b-1"
          />
        ) : (
          email
        )}
      </td>
      <td className="px-6 py-4 text-sm text-start">
        {isEditing ? (
          <div className="relative">
            <select
              value={status}
              onChange={(e) =>
                setCurrentCandidate({
                  ...{ id, name, company, email, score },
                  status: e.target.value,
                } as Lead)
              }
              className="cursor-pointer hover:bg-gray-200 rounded-lg transition duration-300 p-2 pr-6"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Icon id="expand" size={10} />
            </div>
          </div>
        ) : (
          <span className="p-2 pr-6">{status}</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm">{score}</td>

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
