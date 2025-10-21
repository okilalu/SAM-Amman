import React, { useState } from "react";
import type { SelectOption } from "../../types/types";
import { PiCaretDown, PiCaretUp } from "react-icons/pi";

interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (value: string) => void;
  labelClass?: string;
  flex?: "flex-col" | "flex-row";
  placeholder?: string;
  background?: string;
  disabled?: boolean;
}

export const CustomSelects: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  labelClass = "",
  flex = "flex-col",
  placeholder = "Pilih opsi",
  disabled = false,
  background = "bg-white",
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const selectedLabel =
    typeof value === "string"
      ? options.find((opt) => opt.value === value)?.label || placeholder
      : value?.label || placeholder;

  return (
    <div className={`w-full ${flex} flex gap-5 items-center`}>
      {label && (
        <label
          className={`text-sm font-medium min-w-24 text-gray-600 ${labelClass}`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={`w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm ${background} ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
          } duration-300 ease-in-out group`}
        >
          <span
            className={`${
              selectedLabel === placeholder ? "text-gray-400" : "text-gray-800"
            }`}
          >
            {selectedLabel}
          </span>
          <div className="relative w-5 h-5">
            <PiCaretDown
              size={20}
              className={`absolute top-0 left-0 transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <PiCaretUp
              size={20}
              className={`absolute top-0 left-0 transition-opacity duration-200 ${
                open ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </button>

        {open && !disabled && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-3 py-2 cursor-pointer hover:bg-[#63b0ba] hover:text-white ${
                  (typeof value === "string" && value === opt.value) ||
                  (typeof value === "object" && value?.value === opt.value)
                    ? "bg-[#63b0ba] text-white"
                    : ""
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
