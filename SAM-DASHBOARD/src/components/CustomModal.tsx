import { type ReactElement } from "react";
import { CustomButton } from "./CustomButton";

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
  className?: string;
}
export default function ModalRegister({
  id,
  onSubmit,
  onClose,
  showFooter = true,
  confirmText = "OK",
  cancelText = "Cancel",
  title,
  children,
}: CustomModalProps) {
  const handleClose = () => {
    const modal = document.getElementById(String(id)) as HTMLDialogElement;
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
            className="btn btn-sm btn-circle btn-ghost absolute right-5 top-8"
          >
            ✕
          </button>
        </form>
        <div className="">
          <h2 className="text-xl text-black font-semibold px-3 py-3 bg-gray-100 w-full rounded-md">
            {title}
          </h2>
          <div className="mt-5">{children}</div>
          {showFooter && (
            <div className="mt-10 flex gap-5 items-end justify-end">
              <CustomButton
                text={cancelText}
                onClick={handleClose}
                className="btn btn-outline hover:bg-white hover:text-[#63b1bb]   text-[#63b1bb]"
              />
              <CustomButton
                text={confirmText}
                onClick={handleSubmit}
                className="btn text-white bg-[#35567b] hover:bg-[#35567b] hover:text-white"
              />
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
