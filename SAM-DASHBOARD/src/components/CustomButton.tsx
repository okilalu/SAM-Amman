import React from "react";

interface CustomButtonProps {
  text?: string;
  onClick: () => void;
  className?: string;
}

export default function CutomButton({
  text,
  onClick,
  className,
}: CustomButtonProps) {
  return (
    <div className="flex justify-end gap-3">
      <button className={`${className} btn btn-sm px-6`} onClick={onClick}>
        {text}
      </button>
    </div>
  );
}
