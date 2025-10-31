import { useEffect } from "react";
import { useLogs } from "../hooks/useLogHooks";
import { CustomAlert } from "@/components/CustomAlert";
import { FaCheckCircle } from "react-icons/fa";

export default function Logs() {
  const { logs, loading, error, getLogs, success } = useLogs();

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

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      {success && (
        <CustomAlert
          title={success}
          status="alert-success"
          icon={<FaCheckCircle />}
        />
      )}
      <div className="flex gap-3 min-h-screen">
        <div className="flex-1 text-sm text-black">
          {/* Breadcrumbs */}

          {/* Title */}
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Logs Aktivitas
          </h2>

          {/* Status Loading / Error */}
          <div className="rounded-lg shadow bg-white p-5 mb-6">
            {loading && <p>Memuat data...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && logs.length === 0 && <p>Tidak ada data log.</p>}

            {!loading && sortedLogs.length > 0 && (
              <div className="">
                {sortedLogs.map((log) => (
                  <div
                    key={log.id}
                    className=" p-1 border-gray-700 text-gray-700"
                  >
                    <span className="font-medium text-gray-900">
                      {formatDate(log.createdAt).split("/").join("-")} {" - "}{" "}
                    </span>
                    {log.activity}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table Logs */}
        </div>
      </div>
    </>
  );
}
