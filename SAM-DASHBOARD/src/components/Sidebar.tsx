import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdEmail,
  MdGpsFixed,
  MdManageHistory,
} from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { FaRaspberryPi } from "react-icons/fa";
import { TbDeviceImacCode, TbFilterCode } from "react-icons/tb";

import Dashboard from "../Pages/Dashboard";
import Portable from "../Pages/Portable";
import ManageUser from "../Pages/ManageUser";
import ManageEmail from "../Pages/ManageEmail";
import ManageDevice from "../Pages/ManageDevice";
import ManageLocation from "../Pages/ManageLocation";
import ControlDevice from "../Pages/ControlDevice";
import Logs from "../Pages/Logs";
import { useUserData } from "../hooks/useUserHooks";

const getToken = () => {
  try {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;
    const parsed = JSON.parse(auth);
    return parsed?.token || null;
  } catch (error) {
    console.error("Error reading token:", error);
    return null;
  }
};

export default function Sidebar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState("Home");
  const { handleLogout, validateUser, user } = useUserData({});

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    } else {
      validateUser(); // panggil API validasi user
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const Logout = async () => {
    try {
      const res = await handleLogout();
      localStorage.removeItem("auth");
      console.log(res);

      navigate("/login");
      setError("");
      alert("Anda telah logout!");
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
          { name: "Home", icon: <MdDashboard className="text-xl" /> },
          { name: "Portable", icon: <TbFilterCode className="text-xl" /> },
          { name: "Manage User", icon: <GrUserManager className="text-xl" /> },
          { name: "Manage Email", icon: <MdEmail className="text-xl" /> },
          {
            name: "Manage Device",
            icon: <FaRaspberryPi className="text-xl" />,
          },
          { name: "Manage Location", icon: <MdGpsFixed className="text-xl" /> },
          {
            name: "Control Device",
            icon: <TbDeviceImacCode className="text-xl" />,
          },
          { name: "Logs", icon: <MdManageHistory className="text-xl" /> },
        ]
      : [
          { name: "Home", icon: <MdDashboard className="text-xl" /> },
          { name: "Portable", icon: <TbFilterCode className="text-xl" /> },
        ];

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[20%] bg-gray-800 text-white flex flex-col justify-between shadow-lg">
        <div>
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-center">
            <h1 className="text-3xl font-bold tracking-wider">AMMAN</h1>
          </div>

          <nav className="mt-6">
            <ul>
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`px-6 py-3 flex items-center gap-3 cursor-pointer rounded-md transition-all duration-200 ${
                    activeMenu === item.name
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="px-6 py-5 border-t border-gray-700 flex flex-col gap-3">
          {isLoggedIn ? (
            <button
              onClick={Logout}
              className="bg-red-600 hover:bg-red-700 text-center text-white py-2 rounded-md font-semibold transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-center transition text-white py-2 rounded-md font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-center transition text-white py-2 rounded-md font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[20%] w-[80%] h-full overflow-y-auto bg-gray-50 p-6">
        {renderContent()}
      </main>
    </div>
  );
}
