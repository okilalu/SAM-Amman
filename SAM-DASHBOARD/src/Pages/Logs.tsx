import React, { useEffect, useState } from "react";

export default function Logs() {
  // sementara pakai dummy data, nanti bisa diganti dari backend
  const [logs, setLogs] = useState<
    { time: string; speed: string; device: string; status: string }[]
  >([]);

  useEffect(() => {
    // simulasi data masuk setiap 2 detik
    const interval = setInterval(() => {
      setLogs((prev) => [
        {
          time: new Date().toLocaleTimeString(),
          speed: `${Math.floor(Math.random() * 120)} km/h`,
          device: "SAM01",
          status: Math.random() > 0.7 ? "Overspeed" : "Normal",
        },
        ...prev,
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100">
      <div className="flex-1 p-10 pt-12 text-sm text-black">
        {/* Breadcrumbs */}
        <div className="breadcrumbs bg-gray-200 p-3 rounded-md">
          <ul className="flex gap-2">
            <li>
              <a href="" className="text-blue-600">
                Home
              </a>
            </li>
            <li>
              <span className="text-gray-600">Logs</span>
            </li>
          </ul>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 pt-5">Logs</h2>

        {/* Table Logs */}
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="table w-full text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Speed</th>
                <th className="px-4 py-2">Device</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{log.time}</td>
                    <td className="px-4 py-2">{log.speed}</td>
                    <td className="px-4 py-2">{log.device}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        log.status === "Overspeed"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {log.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
