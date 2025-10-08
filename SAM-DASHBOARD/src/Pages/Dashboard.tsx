import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  // Dummy data grafik, nanti bisa diganti dari backend
  const dataPelanggaran = [
    { bulan: "Jan", overspeed: 12 },
    { bulan: "Feb", overspeed: 18 },
    { bulan: "Mar", overspeed: 25 },
    { bulan: "Apr", overspeed: 9 },
    { bulan: "Mei", overspeed: 30 },
    { bulan: "Jun", overspeed: 15 },
  ];

  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100 ">
      <div className="flex-1 p-10 pt-12  text-sm text-black">
        <div className="breadcrumbs bg-gray-200 p-3">
          <div className="divider divider-horizontal" />
          <ul>
            <li>
              <a href="" className="text-blue-600">
                Home
              </a>
            </li>
            <li>
              <a href="">Dashboard</a>
            </li>
          </ul>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 pt-5">
          Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-700">Storage</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Record
            </h2>
            <p className="text-3xl font-bold text-red-600 mt-2">0</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-700">
              Average Speed
            </h2>
            <p className="text-3xl font-bold text-green-600 mt-2">0 km/h</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-700">Over Speed</h2>
            <p className="text-3xl font-bold text-orange-500 mt-2">0 km/h</p>
          </div>
        </div>

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

          <div className="flex justify-between items-center mb-6">
            <div className="bg-gray-300 px-3 py-2 rounded-md">
              <input type="date" className="text-md text-gray-700" />
            </div>

            <div className="flex bg-gray-300 rounded-md overflow-hidden text-sm font-medium text-black">
              <button className="px-3 py-2 hover:bg-gray-400">Day</button>
              <button className="px-3 py-2 hover:bg-gray-400 border-l-gray-800">
                Month
              </button>
              <button className="px-3 py-2 hover:bg-gray-400 border-l-gray-800">
                Year
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataPelanggaran}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="overspeed" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
