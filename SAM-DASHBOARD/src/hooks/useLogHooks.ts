import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../Redux/store";
import type { Log } from "../../types/types";
import { fetchLogs } from "../Redux/slices/logsSlice";

export const useLogs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const getLogs = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await dispatch(fetchLogs()).unwrap();
      console.log(res);

      if (res && Array.isArray(res.data)) {
        setLogs(res.data);
      } else {
        setLogs([]);
      }
      // setSuccess(res?.message ?? "Fetched");
      setSuccess("Logs fetched Successfuly");

      return res;
    } catch (err: any) {
      console.error("❌ Fetch Logs Error:", err);
      setError(err?.message || "Gagal memuat daftar logs");
      return undefined;
    } finally {
      setLoading(false);
    }
  };
  // const getLogs = useCallback(async () => {
  //   setLoading(true);
  //   setError("");
  //   setSuccess("");

  //   try {
  //     const res = await dispatch(fetchLogs()).unwrap();
  //     if (res && Array.isArray(res.data)) {
  //       setLogs(res.data);
  //       console.log(res.data);
  //     } else {
  //       setLogs([]);
  //     }
  //     setSuccess(res?.message ?? "Fetched");

  //     return res;
  //   } catch (err: any) {
  //     setError(err.message || "Failed to fetch logs");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [fetchLogs]);

  // const selectLog = useCallback(
  //   (log: Log | null) => {
  //     setSelected(log);
  //     dispatch(setSelectedLog(log));
  //   },
  //   [dispatch]
  // );

  return {
    logs,
    loading,
    error,
    success,
    setError,
    warning,
    setWarning,
    getLogs,
    navigate,
  };
};
