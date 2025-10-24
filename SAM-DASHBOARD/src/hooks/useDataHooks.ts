import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { filterData, getAll, getAllFilter } from "../Redux/slices/dataSlicer";
import type { AppDispatch } from "../Redux/store";
import type { Datas } from "../../types/types";

export function useData() {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<Datas[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFilterData = async ({
    samId,
    data,
  }: {
    samId: string;
    data: Datas;
  }) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await dispatch(filterData({ samId, data })).unwrap();
      const newData =
        res?.data?.data && Array.isArray(res.data.data) ? res.data.data : [];

      setData(newData);
      setSuccess("Data filtered successfully");
    } catch (err) {
      console.error(err);
      const msg = "Gagal memfilter data";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAllData = async ({ samId }: { samId: string }) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await dispatch(getAll({ samId })).unwrap();
      const newData = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data && Array.isArray(res.data.data)
        ? res.data.data
        : [];

      setData(newData);
      setSuccess("Data loaded successfully");
    } catch (err) {
      console.error(err);
      const msg = "Gagal memuat data";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAllFilter = useCallback(
    async (params: Datas) => {
      setIsLoading(true);
      setError("");
      setSuccess("");
      setChartData([]);
      try {
        const res = await dispatch(
          getAllFilter({
            data: {
              samId: params.samId,
              filterType: params.filterType,
              filterValue: params.filterValue,
            },
          })
        ).unwrap();

        const filteredData = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];

        setChartData(filteredData);
      } catch (err) {
        console.log(err);
        setError("Gagal memuat data filter");
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  return {
    isLoading,
    error,
    success,
    data,
    chartData,
    handleFilterData,
    handleGetAllData,
    handleGetAllFilter,
  };
}
