import React from "react";
import Select, {
  type GroupBase,
  type SingleValue,
  type StylesConfig,
  type ControlProps,
  type CSSObjectWithLabel,
} from "react-select";
import type { SelectOption } from "../../types/types";

interface SelectOptionsProps {
  label?: string;
  placeholder?: string;
  handleChange?: (value: SingleValue<SelectOption>) => void;
  options?: SelectOption[];
  isLoading?: boolean;
  values: SelectOption | null;
  flex?: string;
  labelClass?: string;
}

export const CustomSelect: React.FC<SelectOptionsProps> = ({
  label,
  values,
  placeholder,
  handleChange,
  options,
  isLoading,
  flex = "flex-col",
  labelClass = "justify-between",
}) => {
  const customStyles: StylesConfig<
    SelectOption,
    false,
    GroupBase<SelectOption>
  > = {
    control: (
      provided: CSSObjectWithLabel,
      state: ControlProps<SelectOption, false, GroupBase<SelectOption>>
    ) => ({
      ...provided,
      margin: "0px",
      padding: "0px",
      border: state.isFocused ? "1px solid 0077b6" : "1px solid #cbd5e1",
      borderRadius: "0.3rem",
      boxShadow: state.isFocused ? "0 0 0 1px 0077b6" : undefined,
      "&:hover": {
        borderColor: "0077b6",
      },
      fontSize: "12px",
      color: "#0f172a",
      fontWeight: "500",
      minHeight: "33px",
      height: "33px",
    }),
    container: (provided, state) => ({
      ...provided,
      width: "100%",
      minHeight: "33px",
      backgroundColor: "#fff",
      borderRadius: "0.3rem",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      maxHeight: "200px",
      overflowY: "auto",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "0px",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#0077b6" : provided.backgroundColor,
      color: state.isSelected ? "#fff" : "#0077b6",
      fontSize: "12px",
      lineHeight: "1rem",
      padding: "8px",
    }),
  };

  return (
    <div className={`flex ${flex} ${labelClass} gap-6 w-full`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-600">
          {label}
        </label>
      )}

      <Select
        placeholder={placeholder}
        value={values}
        onChange={handleChange}
        options={options}
        isLoading={isLoading}
        styles={customStyles}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
      />
    </div>
  );
};
