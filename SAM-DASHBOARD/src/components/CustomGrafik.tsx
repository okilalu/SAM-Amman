import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CustomGrafik() {
  // Dummy Data
  const dataDaily = [
    { tanggal: "1", overspeed: 5 },
    { tanggal: "2", overspeed: 8 },
    { tanggal: "3", overspeed: 4 },
    { tanggal: "4", overspeed: 10 },
    { tanggal: "5", overspeed: 7 },
  ];

  const dataMonthly = [
    { bulan: "Jan", overspeed: 12 },
    { bulan: "Feb", overspeed: 18 },
    { bulan: "Mar", overspeed: 25 },
    { bulan: "Apr", overspeed: 9 },
    { bulan: "Mei", overspeed: 30 },
    { bulan: "Jun", overspeed: 15 },
  ];

  const dataYearly = [
    { tahun: "2020", overspeed: 100 },
    { tahun: "2021", overspeed: 180 },
    { tahun: "2022", overspeed: 240 },
    { tahun: "2023", overspeed: 200 },
    { tahun: "2024", overspeed: 300 },
  ];
  const [filter, setFilter] = useState("month");
  const [selectedDate, setSelectedDate] = useState("");
  const data =
    filter === "day"
      ? dataDaily
      : filter === "month"
      ? dataMonthly
      : dataYearly;

  // Tentukan key untuk label XAxis
  const xKey =
    filter === "day" ? "tanggal" : filter === "month" ? "bulan" : "tahun";

  const handleDateFilter = (event: any) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);
    setFilter("day");
  };

  return (
    // Grafil Pelanggaran
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Data Pelanggaran Kendaraan
      </h2>

      <div className="flex border border-gray-300 rounded-md p-3 gap-5 mb-6 bg-gray-50">
        <div className="border bg-gray-400 rounded-md p-2 w-xs">
          <p className="text-black font-semibold">SAM01</p>
        </div>
        <div>
          <p className="text-gray-700">Traffic</p>
          <p className="text-gray-500 text-sm">September 2025</p>
        </div>
      </div>

      {/* Filter dan Date Picker */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-gray-300 px-3 py-2 rounded-md">
          <input
            type="date"
            className="text-md text-gray-700"
            value={selectedDate}
            onChange={handleDateFilter}
          />
        </div>

        <div className="flex bg-gray-300 rounded-md overflow-hidden text-sm font-medium text-black">
          <button
            onClick={() => setFilter("day")}
            className={`px-3 py-2 hover:bg-gray-400 ${
              filter === "day" ? "bg-gray-400 font-semibold" : ""
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setFilter("month")}
            className={`px-3 py-2 hover:bg-gray-400 border-l ${
              filter === "month" ? "bg-gray-400 font-semibold" : ""
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setFilter("year")}
            className={`px-3 py-2 hover:bg-gray-400 border-l ${
              filter === "year" ? "bg-gray-400 font-semibold" : ""
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Grafik */}
      <div className="h-80">
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
      </div>
    </div>
  );
}
