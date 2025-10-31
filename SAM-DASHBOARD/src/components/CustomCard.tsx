import React, { useEffect } from "react";
import type { IconType } from "react-icons";
import { useData } from "@/hooks/useDataHooks";
import { useDeviceData } from "@/hooks/useDeviceHooks";

interface SummaryData {
  samId: string;
  totalRecords: number;
  averageSpeed: number;
  overSpeed: number;
}
interface StorageData {
  path: string;
  total: string;
  used: string;
  free: string;
  usedPercent: string;
  availablePercent: string;
}

interface CustomCardProps {
  title: string;
  color?: string;
  className?: string;
  icon?: IconType;
  type?: "storage" | "totalRecord" | "averageSpeed" | "overspeed";
  value?: SummaryData[];
  valueData?: StorageData;
}

export default function CustomCard({
  title,
  color = "text-blue-600",
  className = "",
  icon: Icon,
  type = "totalRecord",
  value = [],
  valueData,
}: CustomCardProps) {
  const { handleGetSummaryData } = useData();
  const { getSystemInfo } = useDeviceData({});

  useEffect(() => {
    handleGetSummaryData();
  }, []);

  useEffect(() => {
    getSystemInfo();
  }, []);
  console.log(valueData);

  return (
    <div
      className={`bg-gray-100 border border-gray-400 rounded-xl shadow p-6 hover:shadow-lg transition ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        {Icon && <Icon size={22} className={`${color}`} />}
      </div>

      <hr className="border-gray-200 mb-3" />

      {/* Storage Info */}
      {type === "storage" && valueData ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-semibold">{valueData.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Used</span>
            <span className="font-semibold">{valueData.used}</span>
          </div>
          <div className="flex justify-between">
            <span>Free</span>
            <span className="font-semibold">{valueData.free}</span>
          </div>
          <div className="flex justify-between">
            <span>Usage</span>
            <span className="font-semibold">{valueData.usedPercent}</span>
          </div>
          <div className="flex justify-between">
            <span>Available Percent</span>
            <span className="font-semibold">{valueData.availablePercent}</span>
          </div>
        </div>
      ) : null}

      {/* Content */}
      {["totalRecord", "averageSpeed", "overspeed"].includes(type) ? (
        value && value.length > 0 ? (
          <div className="space-y-3 text-sm">
            {value.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2">
                <p className="font-semibold text-gray-600">{item.samId}</p>
                <div className="text-right">
                  {type === "totalRecord" && (
                    <p className={`text-base font-bold ${color}`}>
                      {item.totalRecords.toLocaleString()}
                    </p>
                  )}
                  {type === "averageSpeed" && (
                    <p className={`text-base font-bold ${color}`}>
                      {item.averageSpeed.toFixed(2)} km/h
                    </p>
                  )}
                  {type === "overspeed" && (
                    <p className={`text-base font-bold ${color}`}>
                      {item.overSpeed} km/h
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">Loading data...</p>
        )
      ) : null}
    </div>
  );
}
