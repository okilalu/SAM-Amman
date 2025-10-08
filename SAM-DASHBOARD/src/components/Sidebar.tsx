import React, { useState } from "react";
import {
  MdDashboard,
  MdEmail,
  MdGpsFixed,
  MdManageHistory,
} from "react-icons/md";
import Dashboard from "../Pages/Dashboard";
import Portable from "../Pages/Portable";
import ManageUser from "../Pages/ManageUser";
import ManageEmail from "../Pages/ManageEmail";
import ManageDevice from "../Pages/ManageDevice";
import ManageLocation from "../Pages/ManageLocation";
import ControlDevice from "../Pages/ControlDevice";
import Logs from "../Pages/Logs";
import { GrUserManager } from "react-icons/gr";
import { FaRaspberryPi } from "react-icons/fa";
import { TbDeviceImacCode, TbFilterCode } from "react-icons/tb";

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("Home");

  const renderContent = () => {
    switch (activeMenu) {
      case "Home":
        return <Dashboard />;
      case "Portable":
        return <Portable />;
      case "Manage User":
        return <ManageUser />;
      case "Manage Email":
        return <ManageEmail />;
      case "Manage Device":
        return <ManageDevice />;
      case "Manage Location":
        return <ManageLocation />;
      case "Control Device":
        return <ControlDevice />;
      case "Logs":
        return <Logs />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="h-screen left-0">
      <div>{renderContent()}</div>
      {/* Logo / Judul */}
      <div className="fixed left-0 top-0 h-screen w-[20%]">
        <div className="flex flex-col top-0 left-0 h-full bg-gray-800 text-white justify-between">
          <div>
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-center">
              <h1 className="text-3xl font-bold">AMMAN</h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 mt-6 ">
              <ul className="">
                <li className="px-6 py-3 flex items-center gap-3 hover:bg-gray-700 rounded-md">
                  <MdDashboard className="text-xl" />
                  <button onClick={() => setActiveMenu("Home")}>
                    Dashboard
                  </button>
                </li>
                <li className="px-6 py-3 flex items-center gap-3 hover:bg-gray-700 rounded-md">
                  <TbFilterCode className="text-xl" />
                  <button onClick={() => setActiveMenu("Portable")}>
                    Portable
                  </button>
                </li>
                <li className="px-6 py-3 flex items-center gap-3 hover:bg-gray-700 rounded-md">
                  <GrUserManager className="text-xl" />
                  <button onClick={() => setActiveMenu("Manage User")}>
                    Manage User
                  </button>
                </li>
                <li className="px-6 py-3 flex items-center gap-3 hover:bg-gray-700 rounded-md">
                  <MdEmail className="text-xl" />
                  <button onClick={() => setActiveMenu("Manage Email")}>
                    Manage Email
                  </button>
                </li>
                <li className="px-6 py-3 flex items-center gap-3 hover:bg-gray-700 rounded-md">
                  <FaRaspberryPi className="text-xl" />
                  <button onClick={() => setActiveMenu("Manage Device")}>
                    Manage Device
                  </button>
                </li>
                <li className="px-6 py-3 flex items-center gap-3 hover:bg-gray-700 rounded-md">
                  <MdGpsFixed className="text-xl" />
                  <button onClick={() => setActiveMenu("Manage Location")}>
                    Manage Location
                  </button>
                </li>
                <li className="px-6 py-3 flex items-center gap-3 hover:bg-gray-700 rounded-md">
                  <TbDeviceImacCode className="text-xl" />
                  <button onClick={() => setActiveMenu("Control Device")}>
                    Control Device
                  </button>
                </li>
                <li className="px-6 py-3 flex items-center gap-3 hover:bg-gray-700 rounded-md">
                  <MdManageHistory className="text-xl" />
                  <button onClick={() => setActiveMenu("Logs")}>Logs</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
