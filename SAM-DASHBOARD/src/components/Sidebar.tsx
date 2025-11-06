import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";
import Portable from "../Pages/Portable";
import ManageUser from "../Pages/ManageUser";
import ManageEmail from "../Pages/ManageEmail";
import ManageDevice from "../Pages/ManageDevice";
import ManageLocation from "../Pages/ManageLocation";
import ControlDevice from "../Pages/ControlDevice";
import Logs from "../Pages/Logs";

import { CustomBreadcrumbs } from "./CustomBreadcrumbs";
import { useUserData } from "../hooks/useUserHooks";
import {
  PiHouse,
  PiHouseFill,
  PiFaders,
  PiFadersFill,
  PiDevices,
  PiDevicesFill,
  PiGpsFix,
  PiGpsFixFill,
  PiJoystick,
  PiJoystickFill,
  PiNotepad,
  PiNotepadFill,
  PiGlobeHemisphereWestFill,
  PiUsersThree,
  PiUsersThreeFill,
  PiAt,
  PiAtFill,
  PiDoorOpenFill,
  PiDoor,
  PiList,
  PiX,
} from "react-icons/pi";
import CustomModal from "./CustomModal";
import { CustomMainLoading } from "./CustomMainLoading";
import { CustomButton } from "./CustomButton";

export default function Sidebar() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Home");
  const { handleLogout, validateUser, user, isLoggedIn } = useUserData({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      setIsInitialLoading(true);
      try {
        await validateUser();
      } catch (err) {
        navigate("/login", { replace: true });
        console.log(err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (!isInitialLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [isInitialLoading, user, navigate]);

  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  const Logout = async () => {
    try {
      await handleLogout();
      navigate("/login");
      handleCloseModal("modal_logout");
    } catch (error) {
      console.log(error);
    }
  };

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

  const menuItems =
    user && user.credential !== "Operator"
      ? [
          { name: "Home", icon: PiHouse, iconFill: PiHouseFill },
          { name: "Portable", icon: PiFaders, iconFill: PiFadersFill },
          {
            name: "Manage User",
            icon: PiUsersThree,
            iconFill: PiUsersThreeFill,
          },
          { name: "Manage Email", icon: PiAt, iconFill: PiAtFill },
          { name: "Manage Device", icon: PiDevices, iconFill: PiDevicesFill },
          { name: "Manage Location", icon: PiGpsFix, iconFill: PiGpsFixFill },
          {
            name: "Control Device",
            icon: PiJoystick,
            iconFill: PiJoystickFill,
          },
          { name: "Logs", icon: PiNotepad, iconFill: PiNotepadFill },
        ]
      : [
          { name: "Home", icon: PiHouse, iconFill: PiHouseFill },
          { name: "Portable", icon: PiFaders, iconFill: PiFadersFill },
        ];

  const activeColor = "#63b0ba";
  const inactiveColor = "#000000";

  return (
    <div className="w-full h-screen flex">
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-100 border-r border-[#d7dae0] text-black flex flex-col justify-between shadow-lg z-50 transition-transform duration-300
          w-[70%] sm:w-[50%] md:w-[40%] lg:w-[20%]
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div>
          <div className="px-6 h-16 flex items-center justify-between lg:justify-center border-b border-b-[#d7dae0]">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-gray-800">
              AMMAN
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-2xl text-gray-700 hover:text-[#63b0ba] transition-all"
            >
              <PiX />
            </button>
          </div>

          <nav className="mt-6">
            <ul className="duration-300 ease-in-out">
              {menuItems.map((item) => {
                const isActive = activeMenu === item.name;
                const Icon = isActive ? item.iconFill : item.icon;
                return (
                  <li
                    key={item.name}
                    onClick={() => {
                      setIsMenuLoading(true);
                      setActiveMenu(item.name);
                      setTimeout(() => setIsMenuLoading(false), 500);
                      setIsSidebarOpen(false);
                    }}
                    className={`px-6 py-3 flex items-center gap-3 cursor-pointer rounded-md transition-all duration-200 ${
                      isActive
                        ? "text-[#63b0ba]"
                        : "text-black hover:text-gray-700"
                    }`}
                  >
                    <Icon
                      className={`text-xl transition-all duration-200 ${
                        isActive ? "scale-110" : "scale-100"
                      }`}
                      color={isActive ? activeColor : inactiveColor}
                    />
                    <span>{item.name}</span>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="px-6 py-5 flex flex-col gap-3">
          {isLoggedIn && (
            <button
              onClick={() => handleOpenModal("modal_logout")}
              className="flex items-center cursor-pointer group ease-in-out hover:text-[#de5757] duration-300 gap-3"
            >
              <div className="relative w-5 h-5">
                <PiDoor
                  size={20}
                  className="absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0"
                />
                <PiDoorOpenFill
                  size={20}
                  className="absolute top-0 left-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
                />
              </div>
              <p className="capitalize">log out</p>
            </button>
          )}
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen}
        />
      )}

      <div className="flex-1 lg:ml-[20%] w-[80%] h-screen flex flex-col overflow-hidden">
        <div className="sticky top-0 z-40 shadow-md bg-gray-100 flex items-center px-4 h-16">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className=" lg:hidden text-2xl text-gray-700"
          >
            <PiList />
          </button>
          <CustomBreadcrumbs
            isLoggedIn={isLoggedIn}
            className="rounded-none text-black h-16 pl-5"
            label="Home"
            active={activeMenu === "Home" ? "Dashboard" : activeMenu}
            icon={(() => {
              const Icon = menuItems.find(
                (item) => item.name === activeMenu
              )?.iconFill;
              return Icon ? (
                <Icon size={20} color={activeColor} />
              ) : (
                <PiGlobeHemisphereWestFill size={20} color={activeColor} />
              );
            })()}
          />
        </div>
        <CustomModal
          title="Logout"
          id="modal_logout"
          confirmText="Logout"
          onSubmit={Logout}
          className="btn bg-red-600 text-white hover:bg-red-700 border-t-[1px] border-t-[#d7dae0]"
        >
          <p className="text-black px-3">Apakah anda yakin ingin logout?</p>
        </CustomModal>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {isMenuLoading && activeMenu === "Home" ? (
            <CustomMainLoading
              contents="home"
              contentLines={activeMenu === "Home" ? 1 : 5}
            />
          ) : (
            renderContent()
          )}
        </main>
      </div>
      {!isLoggedIn && (
        <div className="absolute inset-0 z-50 bg-black/5 backdrop-blur-sm flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Session expired or not logged in
          </h2>
          <CustomButton
            justify="justify-center"
            className="cursor-pointer border-none bg-[#63b0ba] text-white px-5 py-2 rounded-lg hover:bg-[#549aa3]"
            onClick={() => navigate("/login")}
            text="Sign In"
          />
        </div>
      )}
    </div>
  );
}
