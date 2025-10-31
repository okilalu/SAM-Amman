import { useEffect, useState } from "react";
import { useDeviceData } from "../hooks/useDeviceHooks";
import { useUserData } from "../hooks/useUserHooks";

interface CustomLoadingProps {
  text?: string;
  //   classname?: string;
}

export default function CustomLoading({ text }: CustomLoadingProps) {
  const { fetchAllDevices } = useDeviceData({});
  const { validateAllUsers } = useUserData({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await validateAllUsers();
      setLoading(false);

      setLoading(true);
      await fetchAllDevices();
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="mt-5">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <span className="loading loading-bars loading-xl text-blue-400"></span>
          {text}
          {/* <p className="ml-3 text-gray-700 text-lg">Memuat data pengguna...</p> */}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
