import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useData } from "../hooks/useDataHooks";
import { useDeviceData } from "../hooks/useDeviceHooks";
import type { SelectOption } from "../../types/types";
import { CustomSelects } from "./CustomSelects";

export default function CustomGrafik() {
  const { data, handleFilterData, handleGetAllData, isLoading } = useData();
  const { devices, fetchAllDevices } = useDeviceData({});
  const [samId, setSamId] = useState<string>("");
  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<SelectOption | null>(
    null
  );

  const getFormattedMonthYear = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  const formattedMonthYear = getFormattedMonthYear(selectedDate);

  useEffect(() => {
    fetchAllDevices();
  }, []);

  useEffect(() => {
    if (devices.length > 0 && !samId) {
      setSamId(devices[0].samId || "");
    }
  }, [devices]);

  useEffect(() => {
    if (samId) {
      handleGetAllData({ samId });
    }
  }, [samId]);

  // === Handler untuk input tanggal ===
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);
    if (!samId) return;

    handleFilterData({
      samId,
      data: {
        startDate: dateValue,
        endDate: dateValue,
        filterType: "day",
      },
    });
    setFilterType("day");
  };

  // === Handler untuk ganti filter ===
  const handleFilterChange = (type: "day" | "month" | "year") => {
    setFilterType(type);
    if (!samId) return;

    handleFilterData({
      samId,
      data: {
        filterType: type,
        selectedDate: selectedDate || null,
      },
    });
  };

  const handleDeviceSelect = (selectedOption: SelectOption) => {
    setSelectedDevice(selectedOption);
    setSamId(selectedOption?.value);
  };

  // === Option dropdown device ===
  const option =
    (Array.isArray(devices) &&
      devices.map((item) => ({
        label: item.samId || "",
        value: item.samId || "",
      }))) ||
    [];

  // === Format data untuk grafik ===
  const formatDataForChart = (rawData: any[]) => {
    if (!Array.isArray(rawData)) return [];

    return rawData.map((item) => {
      const dateObj = new Date(item.createdAt);
      const hour = dateObj.getHours().toString().padStart(2, "0");
      const minute = dateObj.getMinutes().toString().padStart(2, "0");

      return {
        name: `${hour}:${minute}`, // tampil di XAxis
        uv: Number(item.speed) || 0, // tampil di YAxis
      };
    });
  };

  const dataValue = formatDataForChart(data);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Data Pelanggaran Kendaraan
      </h2>

      {/* Info Device */}
      <div className="flex justify-between rounded-md p-3 gap-5 mb-6 bg-gray-50">
        <div className="rounded-none w-xs">
          <CustomSelects
            value={selectedDevice}
            onChange={handleDeviceSelect}
            options={option}
          />
        </div>
        <div className="text-center">
          <p className="text-gray-700">Traffic Data</p>
          <p className="text-gray-500 text-sm">{formattedMonthYear}</p>
        </div>
      </div>

      {/* Filter & Date Picker */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-[#bde1e4] px-3 py-2 rounded-md">
          <input
            type="date"
            className="text-md text-gray-700"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="flex bg-[#bde1e4] rounded-xl overflow-hidden text-sm font-medium border border-[#63b1bb] text-black">
          <button
            onClick={() => handleFilterChange("day")}
            className={`px-3 py-2 cursor-pointer ${
              filterType === "day" ? "bg-[#63b1bb] font-semibold" : ""
            }`}
          >
            Day
          </button>
          <button
            onClick={() => handleFilterChange("month")}
            className={`px-3 py-2 cursor-pointer border-l border-[#63b1bb]  ${
              filterType === "month" ? "bg-[#63b1bb] font-semibold" : ""
            }`}
          >
            Month
          </button>
          <button
            onClick={() => handleFilterChange("year")}
            className={`px-3 py-2 cursor-pointer border-l border-[#63b1bb] ${
              filterType === "year" ? "bg-[#63b1bb] font-semibold" : ""
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Grafik */}
      <div className="h-80">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Loading data...
          </div>
        ) : data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataValue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, "auto"]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="uv"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
