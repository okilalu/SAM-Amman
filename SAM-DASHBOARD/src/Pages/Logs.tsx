import { useEffect } from "react";
import { useLogs } from "../hooks/useLogHooks";
import { CustomBreadcrumbs } from "@/components/CustomBreadcrumbs";

export default function Logs() {
  const { logs, loading, error, getLogs, goToLogDetail } = useLogs();

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  return (
    <div className="flex gap-3 min-h-screen">
      <div className="flex-1 text-sm text-black">
        {/* Breadcrumbs */}
        <CustomBreadcrumbs label="Home" active="Logs" />

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 pt-5">Logs</h2>

        <div className="rounded-lg shadow-lg bg-white flex items-center justify-center">
          {loading && <p>Memuat data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && logs.length === 0 && <p>Tidak ada data log</p>}
        </div>

        {/* Table Logs */}
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <ul>
            {logs.map((log) => (
              <li
                key={log.id}
                className="cursor-pointer hover:text-blue-600"
                onClick={() => goToLogDetail(log.id!)}
              >
                {log.filename} - {log.speed} km/h
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
