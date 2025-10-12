import React, { useCallback, useEffect, useState } from "react";
import { useData } from "../hooks/useDataHooks";
import { useDeviceData } from "../hooks/useDeviceHooks";
import type { Datas } from "../../types/types";

export default function Portable() {
  const { data, handleFilterData, handleGetAllData, isLoading } = useData();
  const { devices, fetchAllDevices } = useDeviceData({});
  const [startDate, setStartDate] = useState("2025-05-06");
  const [endDate, setEndDate] = useState("2025-10-07");
  const [speedFrom, setSpeedFrom] = useState<number>(1);
  const [speedTo, setSpeedTo] = useState<number>(99);
  const [status, setStatus] = useState<"all" | "over speed">("all");
  const [device, setDevice] = useState("SAM02");

  // 🔹 Search function
  const handleSearch = useCallback(() => {
    if (!device) return;
    handleFilterData({
      samId: device,
      data: {
        minSpeed: speedFrom,
        maxSpeed: speedTo,
        startDate,
        endDate,
        category: status,
      } as unknown as Datas,
    });
  }, [
    device,
    speedFrom,
    speedTo,
    startDate,
    endDate,
    status,
    handleFilterData,
  ]);

  // 🔹 Reset filter
  const handleClear = async () => {
    setStartDate("");
    setEndDate("");
    setSpeedFrom(0);
    setSpeedTo(0);
    setStatus("all");

    await handleGetAllData({ samId: device });
  };

  // 🔹 Initial fetch
  useEffect(() => {
    fetchAllDevices();
  }, []);

  // 🔹 Load data awal
  useEffect(() => {
    if (device) handleGetAllData({ samId: device });
  }, [device]);

  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100">
      <div className="flex-1 p-10 pt-12 text-sm text-black">
        {/* Breadcrumb */}
        <div className="breadcrumbs bg-gray-200 text-sm mb-4 p-3 rounded-md">
          <ul>
            <li>
              <a className="text-blue-600">Home</a>
            </li>
            <li>
              <a>Portable</a>
            </li>
          </ul>
        </div>

        <h2 className="text-3xl text-black font-bold mb-8">Portable</h2>

        {/* Filter Section */}
        <div className="bg-white shadow rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            Filter Data
          </h3>

          {/* Date Filter */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-6">
              <label className="font-semibold text-gray-700 w-24">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={(val) => setStartDate(String(val))}
                className="bg-gray-300 input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="font-semibold text-gray-700 w-12">To</label>
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={(val) => setEndDate(String(val))}
                className="bg-gray-300 input input-bordered w-full max-w-xs"
              />
            </div>
          </div>

          {/* Speed Filter */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-6">
              <label className="font-semibold text-gray-700 w-24">Speed</label>
              <input
                type="number"
                name="minSpeed"
                placeholder="Min speed"
                value={speedFrom}
                onChange={(val) => setSpeedFrom(Number(val))}
                className="input bg-gray-300 input-bordered w-full max-w-xs"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="font-semibold text-gray-700 w-12">To</label>
              <input
                type="number"
                name="maxSpeed"
                placeholder="Max speed"
                value={speedTo}
                onChange={(val) => setSpeedTo(Number(val))}
                className="input bg-gray-300 input-bordered w-full max-w-xs"
              />
            </div>
          </div>

          {/* Category & Device */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-center justify-center">
              <div className="flex border rounded-md overflow-hidden cursor-pointer">
                <button
                  onClick={() => setStatus("all")}
                  className={`px-6 py-2 font-semibold ${
                    status === "all"
                      ? "bg-green-600 text-white"
                      : "hover:bg-green-600 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatus("over speed")}
                  className={`px-6 py-2 font-semibold ${
                    status === "over speed"
                      ? "bg-green-500 text-white"
                      : "hover:bg-green-600 hover:text-white"
                  }`}
                >
                  Overspeed
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="font-semibold text-gray-700 w-24">Device</label>
              <select
                value={device}
                onChange={(e) => setDevice(e.target.value)}
                className="select bg-gray-200 max-w-xs"
              >
                {Array.isArray(devices) && devices.length > 0 ? (
                  devices.map((item, idx) => (
                    <option key={idx} value={item.samId}>
                      {item.samId}
                    </option>
                  ))
                ) : (
                  <option disabled>Tidak ada device</option>
                )}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-5 justify-end">
            <button
              onClick={handleSearch}
              className="btn btn-info px-10 text-white"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
            <button onClick={handleClear} className="btn btn-ghost px-10">
              Clear
            </button>
          </div>
        </div>

        {/* Result Table */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Result</h3>
          {isLoading ? (
            <div className="p-5 text-center text-gray-500 border border-dashed rounded-lg">
              Loading Data...
            </div>
          ) : data && data.length > 0 ? (
            <table className="table w-full text-sm shadow rounded-sm">
              <thead className="bg-gray-200 text-black text-center">
                <tr className="bg-gray-100">
                  <th className="p-3">ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Speed</th>
                  <th className="p-3">DeviceId</th>
                  <th className="p-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.createdAt}</td>
                    <td className="p-3">{item.speed} km/h</td>
                    <td className="p-3">{item.samId}</td>
                    <td className="p-3">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-5 text-center text-gray-500 border border-dashed rounded-lg">
              No data to show
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
