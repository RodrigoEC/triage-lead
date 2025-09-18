export const Input = ({
  text,
  onChange,
}: {
  text: string;
  onChange: (field: string, value: string) => void;
}) => {
  return (
    <input
      type="text"
      placeholder={"type to filter..."}
      onChange={(e) => onChange(text, e.target.value)}
      className="w-full min-w-[100px] mt-1 pb-1 border-b-1 placeholder-gray-400"
    />
  );
};
