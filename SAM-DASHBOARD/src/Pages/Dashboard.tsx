import {
  FaDatabase,
  FaTachometerAlt,
  FaExclamationTriangle,
  FaHdd,
} from "react-icons/fa";
import CustomGrafik from "../components/CustomGrafik";
import CustomCard from "../components/CustomCard";
import { useData } from "@/hooks/useDataHooks";
import { useDeviceData } from "@/hooks/useDeviceHooks";
import { useEffect } from "react";

export default function Dashboard() {
  const { summary, handleGetSummaryData } = useData();
  const { storage, getSystemInfo } = useDeviceData({});

  useEffect(() => {
    handleGetSummaryData();
    getSystemInfo();
  }, []);

  return (
    <div className="flex gap-3">
      <div className="flex-1 text-sm text-black">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <CustomCard
            className="bg-green-50 border-green-400"
            title="Storage"
            color="text-green-500"
            icon={FaHdd}
            type="storage"
            valueData={storage}
          />
          <CustomCard
            className="bg-blue-50 border-blue-400"
            title="Total Record"
            color="text-blue-500"
            icon={FaDatabase}
            type="totalRecord"
            value={summary}
          />
          <CustomCard
            className="bg-orange-50 border-orange-400"
            title="Average Speed"
            color="text-orange-500"
            icon={FaTachometerAlt}
            type="averageSpeed"
            value={summary}
          />
          <CustomCard
            className="bg-red-50 border-red-400"
            title="Over Speed"
            color="text-red-500"
            icon={FaExclamationTriangle}
            type="overspeed"
            value={summary}
          />
        </div>

        <div className="mb-10">
          <CustomGrafik />
        </div>
      </div>
    </div>
  );
}
