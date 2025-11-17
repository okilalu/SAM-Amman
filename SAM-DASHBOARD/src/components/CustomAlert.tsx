import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomAlertProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  duration?: number;
  onClose?: () => void;
  status?: string;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  title,
  description,
  icon,
  duration = 3000,
  onClose,
  status,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="
            fixed z-50
            w-full px-4
            bottom-4 left-1/2
            -translate-x-1/2
            sm:left-auto sm:translate-x-0
            sm:bottom-6 sm:right-6
            sm:w-full sm:max-w-sm
          "
        >
          <div
            role="alert"
            className={`alert shadow-lg border ${status} flex items-center gap-3 px-4 py-3`}
          >
            {icon && <div className="text-xl sm:text-2xl">{icon}</div>}

            <div className="flex flex-col">
              <span className="font-semibold text-sm sm:text-base text-black">
                {title}
              </span>
              {description && (
                <span className="text-xs sm:text-sm text-black">
                  {description}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
