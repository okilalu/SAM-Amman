import { Result } from "postcss";
import React, { useState } from "react";

export default function Portable() {
  const dummyData = [
    {
      id: 1,
      date: "2025-10-01",
      speed: 60,
      device: "SAM01",
      type: "All",
    },
    {
      id: 2,
      date: "2025-10-02",
      speed: 80,
      device: "SAM02",
      type: "Overspeed",
    },
    {
      id: 3,
      date: "2025-10-03",
      speed: 95,
      device: "SAM03",
      type: "Overspeed",
    },
    {
      id: 4,
      date: "2025-10-05",
      speed: 50,
      device: "SAM04",
      type: "All",
    },
  ];

  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    minSpeed: "",
    maxSpeed: "",
    type: "All",
    device: "",
  });

  const [filteredData, setFilteredData] = useState(dummyData);

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleTypeFilter = (type) => {
    setFilter({ ...filter, type });
  };

  const handleSearch = () => {
    let result = dummyData;

    if (filter.startDate) {
      result = result.filter((item) => item.date >= filter.startDate);
    }
    if (filter.endDate) {
      result = result.filter((item) => item.date <= filter.endDate);
    }

    if (filter.minSpeed) {
      result = result.filter((item) => item.speed >= Number(filter.minSpeed));
    }
    if (filter.maxSpeed) {
      result = result.filter((item) => item.speed <= Number(filter.maxSpeed));
    }

    if (filter.type !== "All") {
      result = result.filter((item) => item.type === filter.type);
    }
    if (filter.device) {
      result = result.filter((item) =>
        item.device.toLowerCase().includes(filter.device.toLowerCase())
      );
    }
    setFilteredData(result);
  };
  const handleClear = () => {
    setFilter({
      startDate: "",
      endDate: "",
      minSpeed: "",
      maxSpeed: "",
      type: "All",
      device: "",
    });
    setFilteredData(dummyData);
  };

  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100">
      <div className="flex-1 p-10 pt-12 text-sm text-black">
        <div className="breadcrumbs bg-gray-200 text-sm mb-4 p-3">
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

        <div className="bg-white shadow rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            Filter Data
          </h3>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-6">
              <label className="font-semibold text-gray-700 w-24">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={handleChange}
                className="bg-gray-300 input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="flex items-center gap-15">
              <label className="font-semibold text-gray-700 w-12">To</label>
              <input
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={handleChange}
                className="input bg-gray-300 input-bordered w-full max-w-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-6">
              <label className="font-semibold text-gray-700 w-24">Speed</label>
              <input
                name="minSpeed"
                placeholder="Min speed"
                value={filter.minSpeed}
                onChange={handleChange}
                className="input bg-gray-300 input-bordered w-full max-w-xs"
              />
            </div>
            <div className="flex items-center gap-15">
              <label className="font-semibold text-gray-700 w-12">To</label>
              <input
                name="maxSpeed"
                placeholder="Max speed"
                value={filter.maxSpeed}
                onChange={handleChange}
                className="input bg-gray-300 input-bordered w-full max-w-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-center justify-center">
              <div className="flex border rounded-md overflow-hidden cursor-pointer">
                <button
                  onClick={() => handleTypeFilter("All")}
                  className={`px-6 py-2 font-semibold ${
                    filter.type === "All"
                      ? "bg-green-600 text-white"
                      : "hover:bg-green-600 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleTypeFilter("Overspeed")}
                  className={`px-6 py-2 font-semibold ${
                    filter.type === "Overspeed"
                      ? "bg-green-500"
                      : "hover:bg-green-600 hover:text-white"
                  }`}
                >
                  Overspeed
                </button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="font-semibold text-gray-700 w-24">Device</label>
              <input
                type="text"
                name="device"
                value={filter.device}
                onChange={handleChange}
                placeholder="Device ID"
                className="input bg-gray-300 input-bordered w-full max-w-xs"
              />
            </div>
          </div>

          <div className="flex gap-5 justify-end">
            <button onClick={handleSearch} className="btn btn-info px-10">
              Search
            </button>
            <button onClick={handleClear} className="btn btn-ghost px-10">
              Clear
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Result</h3>
          {filteredData.length > 0 ? (
            <table className="table w-full text-sm shadow rounded-sm">
              <thead className="bg-gray-200 text-black text-center">
                <tr className="bg-gray-100">
                  <th className="p-3">ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Speed</th>
                  <th className="p-3">Device</th>
                  <th className="p-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="text-center">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">{item.speed} km/h</td>
                    <td className="p-3">{item.device}</td>
                    <td className="p-3">{item.type}</td>
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
