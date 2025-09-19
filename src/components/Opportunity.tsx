import { useState } from 'react';
import { updateOpportunity } from '../api/opportunities';
import { Icon } from './Icon';
import type { IOpportunity } from '../util/interfaces';
import { Select } from './Select';
import { STAGE_OPTIONS } from '../util/constants';

interface OpportunityProps {
  opportunity: IOpportunity;
  onUpdate: () => void;
}

const AmountDisplay = ({ amount }: { amount: number | null }) => {
  if (amount === null) {
    return <span className="text-gray-500">N/A</span>;
  }
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return <span className="text-gray-900">{formattedAmount}</span>;
};

export const Opportunity = ({ opportunity, onUpdate }: OpportunityProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState(opportunity);

  const handleSave = () => {
    if (
      currentOpportunity.amount !== null &&
      isNaN(Number(currentOpportunity.amount))
    ) {
      alert('Please enter a valid amount.');
      return;
    }

    updateOpportunity(currentOpportunity.id, {
      stage: currentOpportunity.stage,
      amount:
        currentOpportunity.amount === null
          ? null
          : Number(currentOpportunity.amount),
    });
    onUpdate();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentOpportunity(opportunity);
    setIsEditing(false);
  };

  return (
    <tr className="group bg-white hover:bg-gray-50">
      <td className="shadow-2xl lg:shadow-none box-border sticky left-0 z-10 bg-white px-6 py-4 text-sm text-gray-900 text-start group-hover:bg-gray-50">
        {currentOpportunity.name}
      </td>
      <td className="px-6 py-4 text-sm text-start">
        {currentOpportunity.accountName}
      </td>
      <td className="px-6 py-4 text-sm text-start">
        {isEditing ? (
          <input
            type="number"
            value={currentOpportunity.amount ?? ''}
            onChange={e =>
              setCurrentOpportunity({
                ...currentOpportunity,
                amount: e.target.value === '' ? null : Number(e.target.value),
              })
            }
            className="w-full min-w-[100px] mt-1 pb-1 border-b-1 placeholder-gray-400"
          />
        ) : (
          <AmountDisplay amount={currentOpportunity.amount} />
        )}
      </td>
      <td className="px-6 py-4 text-sm text-center">
        <Select
          value={currentOpportunity.stage}
          isEditing={isEditing}
          options={STAGE_OPTIONS}
          onChange={(stage: string) =>
            setCurrentOpportunity({
              ...currentOpportunity,
              stage: stage as IOpportunity['stage'],
            })
          }
        />
      </td>
      <td className="flex gap-2 px-6 py-4 text-sm text-right font-medium w-[6rem]">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="p-2 text-green-700" title="Save">
              <Icon id="check" size={18} />
            </button>
            <button onClick={handleCancel} className="p-2 text-red-700" title="Cancel">
              <Icon id="cancel" size={15} />
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="p-2" title="Edit">
            <Icon id="edit" size={18} />
          </button>
        )}
      </td>
    </tr>
  );
};
