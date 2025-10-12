import React, { type ReactElement } from "react";
import CustomButton from "./CustomButton";

interface CustomModalProps {
  onSubmit?: () => void;
  onClose?: () => void;
  onChange?: (index: number) => void;
  id?: string;
  title: string;
  children?: ReactElement;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  width?: string;
}
export default function ModalRegister({
  id,
  onSubmit,
  onClose,
  onChange,
  showFooter = true,
  confirmText = "OK",
  cancelText = "Cancel",
  title,
  children,
  width = "max-2-xl",
}: CustomModalProps) {
  const handleClose = () => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) modal.close();
    if (onClose) onClose();
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit();
    handleClose();
  };

  return (
    <dialog id={id!} className="modal">
      <div className="modal-box bg-white">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <div className="">
          <h2 className="text-xl font-semibold px-2 py-3 bg-gray-100 w-full rounded-md">
            {title}
          </h2>
          <div className="mt-5">{children}</div>
          {showFooter && (
            <div className="mt-20 flex gap-5 items-end justify-end">
              <CustomButton text={cancelText} onClick={handleClose} />
              <CustomButton text={confirmText} onClick={handleSubmit} />
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
