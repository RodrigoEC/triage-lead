import { useState } from 'react';
import { updateLead } from '../api/leads';
import { Email } from './Email';
import type { ILead } from '../util/interfaces';
import { Select } from './Select';
import { STATUS_OPTIONS } from '../util/constants';

interface LeadDetailPanelProps {
  lead: ILead;
  onUpdate: () => void;
  onClose: () => void;
}

const LeadDetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col items-start gap-2 py-4 px-0">
    <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
    <dd className="w-fit mt-1 text-sm leading-6 text-gray-700 ">
      {value}
    </dd>
  </div>
);

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

export const LeadDetailPanel = ({
  lead,
  onUpdate,
  onClose,
}: LeadDetailPanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currLead, setCurrLead] = useState(lead);

  const handleSave = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currLead.email)) {
      alert('Please enter a valid email.');
      return;
    }

    updateLead(currLead.id, {
      email: currLead.email,
      status: currLead.status,
    });
    onUpdate();
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setCurrLead(lead);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          {currLead.name}
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          {currLead.company}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <LeadDetailItem
            label="Email address"
            value={
              isEditing ? (
                <Email
                  lead={currLead}
                  isEditing={isEditing}
                  onChange={setCurrLead}
                />
              ) : (
                <a
                  href={`mailto:${currLead.email}`}
                  className="text-green-600 hover:text-green-800"
                >
                  {currLead.email}
                </a>
              )
            }
          />
          <LeadDetailItem
            label="Status"
            value={
              <Select
                defaultValue={currLead.status}
                isEditing={isEditing}
                options={STATUS_OPTIONS.filter(
                  (option) => option !== 'converted',
                )}
                onChange={(status: string) =>
                  setCurrLead({
                    ...currLead,
                    status: status as ILead['status'],
                  })
                }
              />
            }
          />
          <LeadDetailItem
            label="Lead Score"
            value={<ScoreBadge score={currLead.score} />}
          />
          <LeadDetailItem label="Source" value={currLead.source} />
        </dl>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {isEditing ? (
          <>
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              Save
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};
