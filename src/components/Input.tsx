import { useCallback } from "react";
import { debounce } from "../util";

export const Input = ({
  text,
  onChange,
}: {
  text: string;
  onChange: (field: string, value: string) => void;
}) => {
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((field: string, val: string) => {
      onChange(field, val);
    }, 750),
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(text, e.target.value);
  };

  return (
    <input
      type="text"
      placeholder={"type to filter..."}
      onChange={handleChange}
      className="w-full min-w-[100px] mt-1 pb-1 border-b-1 placeholder-gray-400"
    />
  );
};
