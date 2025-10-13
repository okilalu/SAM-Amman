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

export default function CustomGrafik() {
  const { data, handleFilterData, handleGetAllData, isLoading } = useData();
  const { devices, fetchAllDevices } = useDeviceData({});
  const [samId, setSamId] = useState<string>("");
  const [filterType, setFilterType] = useState<"day" | "month" | "year">(
    "month"
  );
  const [selectedDate, setSelectedDate] = useState<string>("");

  const getFormattedMonthYear = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date(); // jika tidak ada dateStr → pakai tanggal sekarang
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  const formattedMonthYear = getFormattedMonthYear(selectedDate);

  useEffect(() => {
    fetchAllDevices();
  }, []);

  useEffect(() => {
    if (devices.length > 0 && !samId) {
      setSamId(devices[0].samId);
    }
  }, [devices]);

  useEffect(() => {
    if (samId) {
      handleGetAllData({ samId });
    }
  }, [samId]);

  // Pilih key X-Axis berdasarkan filter
  const xKey =
    filterType === "day"
      ? "tanggal"
      : filterType === "month"
      ? "bulan"
      : "tahun";

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);
    if (!samId) return;

    const filterPayload = {
      samId,
      data: {
        startDate: dateValue,
        endDate: dateValue,
        filterType: "day",
      },
    };
    handleFilterData({ data: filterPayload.data, samId });
    setFilterType("day");
  };

  // Handle filter day/month/year
  const handleFilterChange = (type: "day" | "month" | "year") => {
    setFilterType(type);
    if (!samId) return;

    const filterPayload = {
      samId,
      data: {
        filterType: type,
        selectedDate: selectedDate || null,
      },
    };

    handleFilterData({ data: filterPayload.data, samId });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Data Pelanggaran Kendaraan
      </h2>

      {/* Info Device */}
      <div className="flex border border-gray-300 rounded-md p-3 gap-5 mb-6 bg-gray-50">
        <div className="border bg-gray-400 rounded-md p-2 w-xs">
          <select
            className="bg-gray-100 rounded-md p-1 font-semibold text-black"
            value={samId}
            onChange={(e) => setSamId(e.target.value)}
          >
            {devices.length > 0 ? (
              devices.map((d, i) => (
                <option key={i} value={d.samId}>
                  {d.samId}
                </option>
              ))
            ) : (
              <option disabled>Tidak ada Device</option>
            )}
          </select>
        </div>
        <div>
          <p className="text-gray-700">Traffic Data</p>
          <p className="text-gray-500 text-sm">{formattedMonthYear}</p>
        </div>
      </div>

      {/* Filter & Date Picker */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-gray-300 px-3 py-2 rounded-md">
          <input
            type="date"
            className="text-md text-gray-700"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="flex bg-gray-300 rounded-md overflow-hidden text-sm font-medium text-black">
          <button
            onClick={() => handleFilterChange("day")}
            className={`px-3 py-2 hover:bg-gray-400 ${
              filterType === "day" ? "bg-gray-400 font-semibold" : ""
            }`}
          >
            Day
          </button>
          <button
            onClick={() => handleFilterChange("month")}
            className={`px-3 py-2 hover:bg-gray-400 border-l ${
              filterType === "month" ? "bg-gray-400 font-semibold" : ""
            }`}
          >
            Month
          </button>
          <button
            onClick={() => handleFilterChange("year")}
            className={`px-3 py-2 hover:bg-gray-400 border-l ${
              filterType === "year" ? "bg-gray-400 font-semibold" : ""
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
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="overspeed"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
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
