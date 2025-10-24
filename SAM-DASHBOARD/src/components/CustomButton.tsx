interface CustomButtonProps {
  text?: string;
  onClick: () => void;
  className?: string;
  justify?: string;
  disabled?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  className,
  justify = "justify-end",
  disabled,
}) => {
  return (
    <div className={`flex ${justify} gap-3`}>
      <button
        disabled={disabled}
        className={`${className} btn btn-sm px-6`}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};
