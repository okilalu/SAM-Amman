import React, { type ReactElement } from "react";
import { PiGlobeHemisphereWestFill, PiUser } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "./CustomButton";

interface CustomBreadcrumbsProps {
  label?: string;
  active: string;
  isLoggedIn?: boolean;
  className?: string;
  icon?: ReactElement;
}
export const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({
  label,
  active,
  isLoggedIn = false,
  className = "rounded-md",
  icon = <PiGlobeHemisphereWestFill size={20} color="#63b0ba" />,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-gray-300 px-3 pr-8 py-1 ${className} flex items-center justify-between`}
    >
      <div className="breadcrumbs shadow-none">
        <div className="divider divider-horizontal" />
        <ul>
          <li className="flex items-center gap-2">
            {icon}
            <a href="#" className="text-[#63b0ba] font-bold">
              {label}
            </a>
          </li>
          <li>
            <a className="" href="#">
              {active}
            </a>
          </li>
        </ul>
      </div>
      {!isLoggedIn ? (
        <div>
          <CustomButton
            onClick={() => navigate("/login")}
            text="Sign In"
            className="bg-transparent border-none shadow-none font-bold text-[#63b1bb]"
          />
        </div>
      ) : (
        <div>
          <PiUser size={20} color="#63b0ba" />
        </div>
      )}
    </div>
  );
};
