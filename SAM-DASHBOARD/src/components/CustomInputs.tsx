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
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
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
  disabled,
  min,
  max,
  step,
}) => {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const hasHelper = String(value)?.length > 0 && helper;

  return (
    <div
      className={`${className} flex flex-col gap-2 
    sm:flex-col 
    md:flex-row md:items-center md:gap-5`}
    >
      {/* LABEL */}
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-gray-700 md:min-w-24"
      >
        {label}
      </label>

      {/* INPUT WRAPPER */}
      <div className="relative w-full">
        <input
          value={value}
          id={inputId}
          type={type}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`
        w-full p-2 py-1.5 text-sm rounded-md border border-gray-300
        focus:outline-none focus:ring-0
        pr-${hasHelper && type !== "date" ? "12" : "3"}
        bg-white
      `}
        />

        {/* DATE ICON */}
        {type === "date" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <PiCalendarDots size={20} />
          </div>
        )}

        {/* HELPER BUTTON */}
        {type !== "date" && hasHelper && (
          <button
            type="button"
            onClick={helper}
            className="absolute right-2 top-1/2 -translate-y-1/2 
        text-blue-600 text-sm font-medium cursor-pointer"
          >
            {helperText}
          </button>
        )}
      </div>
    </div>
  );
};
