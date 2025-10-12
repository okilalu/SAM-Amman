import React, { use } from "react";
import { filterData, getAll } from "../Redux/slices/dataSlicer";
import type { AppDispatch } from "../Redux/store";
import type { Datas } from "../../types/types";
import { useState } from "react";
import { useDispatch } from "react-redux";

export function useData() {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<Datas[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //   Filter Data
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

    console.log(samId, data);
    try {
      const res = await dispatch(filterData({ samId, data })).unwrap();

      console.log(res);

      setData(res?.data?.data || []);
      setSuccess("data filtered succesfully");
    } catch (error) {
      console.log(error);
      const msg = "Gagal memfilter data";
      alert(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  //   GetAll data
  const handleGetAllData = async ({ samId }: { samId: string }) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await dispatch(getAll({ samId })).unwrap();
      console.log(res.data);

      if (Array.isArray(res?.data)) {
        setData(res.data);
      } else if (res?.data.data && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else {
        setData([]);
      }
      // alert("berhasil memuat semua data");
      setSuccess("Data loaded seccesfully");
    } catch (error) {
      console.log(error);
      const msg = "Gagal memuat data";
      alert(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    data,
    handleFilterData,
    handleGetAllData,
  };
}
