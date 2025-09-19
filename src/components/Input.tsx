import { useCallback, useEffect, useState } from "react";
import { debounce } from "../util";

export const Input = ({
  text,
  onChange,
  defaultValue = "",
}: {
  text: string;
  onChange: (field: string, value: string) => void;
  defaultValue?: string;
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((field: string, val: string) => {
      onChange(field, val);
    }, 750),
    [onChange],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debouncedOnChange(text, e.target.value);
  };

  return (
    <input
      type="text"
      value={value}
      placeholder={"type to filter..."}
      onChange={handleChange}
      className="w-full min-w-[100px] mt-1 pb-1 border-b-1 placeholder-gray-400"
    />
  );
};
