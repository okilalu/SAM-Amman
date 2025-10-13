import React, {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface NotificationAlertProps {
  text: string;
  durations?: number;
  icon: ReactNode;
}
export const NotificationAlert: React.FC<NotificationAlertProps> = ({
  durations = 3000,
  text,
  icon,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [animate, setAnimate] = useState<string>("translate-y-[-100px]");
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timerIn = setTimeout(() => {
      setAnimate("translate-y-0");
    }, 10);

    const timerOut = setTimeout(() => {
      setAnimate("translate-y-[-100px]");
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }, durations);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timerOut);
    };
  }, [durations]);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
      setAnimate("translate-y-[-100px]");
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleOverlayClick}
      />
      <div
        ref={notificationRef}
        className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-50 transition-transform duration-300 ease-in-out ${animate}`}
      >
        <div className="flex gap-[6px] py-[6px] px-[18px] bg-custom-white-1 rounded-xl items-center justify-center shadow-lg">
          {icon}
          <p className="text-xs text-slate-900">{text}</p>
        </div>
      </div>
    </>
  );
};
