import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchLogs, setSelectedLog } from "../Redux/slices/logsSlice";
import type { AppDispatch } from "../Redux/store";
import type { Log } from "../../types/types";

export const useLogs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedLog, setSelected] = useState<Log | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await dispatch(fetchLogs()).unwrap();
      setLogs(result || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const selectLog = useCallback(
    (log: Log | null) => {
      setSelected(log);
      dispatch(setSelectedLog(log));
    },
    [dispatch]
  );

  return {
    logs,
    loading,
    error,
    selectedLog,
    getLogs,
    selectLog,
    navigate,
  };
};
