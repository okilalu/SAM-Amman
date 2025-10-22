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
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed bottom-8 right-6 z-50 w-full max-w-md"
        >
          <div role="alert" className={` alert shadow-lg border ${status}`}>
            {icon}

            <div className="text-black">{title}</div>
            {description && <div className="text-black">{description}</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
