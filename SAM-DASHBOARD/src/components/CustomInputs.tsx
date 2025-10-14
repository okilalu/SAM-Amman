import React from "react";

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

  return (
    <div className={`${className} flex items-center gap-5`}>
      <label
        htmlFor={inputId}
        className="flex-1 text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <div className="flex flex-1 items-center relative">
        <input
          value={value}
          id={inputId}
          type={type}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 py-1.5 border rounded-md border-gray-300 focus:outline-none focus:ring-0 focus:ring-blue-500"
        />
        {String(value)?.length! > 0 ? (
          <button
            type="button"
            onClick={helper}
            className="cursor-pointer rounded-md absolute right-0 px-3 py-3 no-underline text-blue-600 text-sm"
          >
            {helperText}
          </button>
        ) : null}
      </div>
    </div>
  );
};
