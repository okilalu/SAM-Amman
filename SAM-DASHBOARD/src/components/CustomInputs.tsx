import React from "react";
import { PiCalendarDots } from "react-icons/pi";

interface CustomInputsProps {
  label: string;
  type?: string;
  onChange?: (val: string) => void;
  placeholder: string;
  className?: string;
  helper?: () => void;
  helperText?: string;
  id?: string;
  value: string | number;
}

export const CustomInputs: React.FC<CustomInputsProps> = ({
  label,
  type = "text",
  onChange,
  placeholder,
  className = "",
  helper,
  helperText,
  value,
  id,
}) => {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const hasHelper = String(value)?.length > 0 && helper;

  return (
    <div className={`${className} flex items-center gap-5`}>
      <label
        htmlFor={inputId}
        className="min-w-24 text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <div className="flex w-full items-center relative">
        <input
          value={value}
          id={inputId}
          type={type}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 p-2 py-1.5 border rounded-md border-gray-300 focus:outline-none focus:ring-0 ${
            hasHelper && type !== "date" ? "pr-12" : ""
          }`}
        />

        {type === "date" && (
          <div className="absolute right-3 top-2 h-5 w-5 text-gray-500 pointer-events-none">
            <PiCalendarDots size={20} className="" />
          </div>
        )}

        {type !== "date" && hasHelper && (
          <button
            type="button"
            onClick={helper}
            className="cursor-pointer rounded-md absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 text-sm"
          >
            {helperText}
          </button>
        )}
      </div>
    </div>
  );
};
