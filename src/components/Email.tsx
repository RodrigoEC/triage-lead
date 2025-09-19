import type { Lead } from "../util/interfaces";

export const Email = ({
  candidate,
  isEditing,
  onChange,
}: {
  candidate: Lead;
  isEditing: boolean;
  onChange: (candidate: Lead) => void;
}) => {
  return isEditing ? (
    <input
      type="email"
      value={candidate.email}
      onChange={(e) =>
        onChange({
          ...candidate,
          email: e.target.value,
        } as Lead)
      }
      className="block w-full border-b-1 mt-1 pb-1"
    />
  ) : (
    candidate.email
  );
};
