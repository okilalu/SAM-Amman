import { useEffect } from "react";
import { useLogs } from "../hooks/useLogHooks";

export default function Logs() {
  const { logs, loading, error, getLogs } = useLogs();

  console.log(logs);

  useEffect(() => {
    getLogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex gap-3 min-h-screen pt-7 bg-gray-100">
      <div className="flex-1 p-10 pt-12 text-sm text-black">
        {/* Breadcrumbs */}
        <div className="breadcrumbs bg-gray-200 p-3 rounded-md mb-5">
          <ul className="flex gap-2">
            <li>
              <a href="/" className="text-blue-600">
                Home
              </a>
            </li>
            <li>
              <span className="text-gray-600">Logs</span>
            </li>
          </ul>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Logs Aktivitas
        </h2>

        {/* Status Loading / Error */}
        <div className="rounded-lg shadow bg-white p-5 mb-6">
          {loading && <p>Memuat data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && logs.length === 0 && <p>Tidak ada data log.</p>}
          {!loading && logs.length > 0 && (
            <div className="">
              {logs.map((log: any, index: number) => (
                <div key={log.id} className="">
                  {formatDate(log.createdAt).split("/").join("-")} {" - "}{" "}
                  {log.activity}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Logs */}
      </div>
    </div>
  );
}
