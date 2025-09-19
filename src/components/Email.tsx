import type { ILead } from "../util/interfaces";

export const Email = ({
  lead,
  isEditing,
  onChange,
}: {
  lead: ILead;
  isEditing: boolean;
  onChange: (lead: ILead) => void;
}) => {
  return isEditing ? (
    <input
      type="email"
      value={lead.email}
      onChange={(e) =>
        onChange({
          ...lead,
          email: e.target.value,
        } as ILead)
      }
      className="block w-full border-b-1 mt-1 pb-1"
    />
  ) : (
    lead.email
  );
};
