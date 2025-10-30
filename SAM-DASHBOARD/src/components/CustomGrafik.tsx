import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useData } from "../hooks/useDataHooks";
import type { SelectOption } from "../../types/types";
import { CustomSelects } from "./CustomSelects";
import { useUserDeviceData } from "@/hooks/useUserDeviceHooks";
import { CustomMainLoading } from "./CustomMainLoading";

export default function CustomGrafik() {
  const { chartData, handleGetAllFilter, isLoading } = useData();
  const { accessible, fetchAllAccessible } = useUserDeviceData({});
  const [samId, setSamId] = useState<string>("");
  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  useEffect(() => {
    fetchAllAccessible();
  }, []);

  useEffect(() => {
    if (accessible.length > 0 && !samId) {
      const firstSamId = accessible[0].samId || "";
      setSamId(firstSamId);
      setSelectedDevice(firstSamId);
      fetchChartData(firstSamId, filterType, selectedDate);
    }
  }, [accessible]);

  const formattedMonthYear = selectedDate
    ? new Date(selectedDate).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "";

  const fetchChartData = (
    samIdParam: string,
    filterTypeParam: "day" | "month" | "year",
    dateParam?: string
  ) => {
    if (!samIdParam) return;

    let filterValue: string | undefined = undefined;

    if (filterTypeParam === "day" && dateParam) {
      filterValue = dateParam;
    } else if (filterTypeParam === "month" && dateParam) {
      const date = new Date(dateParam);
      filterValue = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
    } else if (filterTypeParam === "year" && dateParam) {
      filterValue = `${new Date(dateParam).getFullYear()}`;
    }

    handleGetAllFilter({
      samId: samIdParam,
      filterType: filterTypeParam,
      filterValue,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    if (!samId) return;
    fetchChartData(samId, filterType, dateValue);
  };

  const handleFilterChange = (type: "day" | "month" | "year") => {
    setFilterType(type);
    if (!samId) return;
    fetchChartData(samId, type, selectedDate);
  };

  const handleDeviceSelect = (selectedOption: string | null) => {
    setSelectedDevice(selectedOption);
    if (selectedOption) {
      setSamId(selectedOption);
      fetchChartData(selectedOption, filterType, selectedDate);
    }
  };

  const option: SelectOption[] = Array.isArray(accessible)
    ? accessible.map((item) => ({
        label: item.samId || "",
        value: item.samId || "",
      }))
    : [];

  const downSampleData = (rawData: any[], maxPoints: number) => {
    if (!rawData || rawData.length <= maxPoints) return rawData;
    const step = Math.ceil(rawData.length / maxPoints);
    return rawData.filter((_, i) => i % step === 0);
  };

  const dataValue = useMemo(() => {
    const mapped = Array.isArray(chartData)
      ? chartData.map((d: any) => ({
          name: d?.createdAt || "",
          uv: d?.speed || 0,
        }))
      : [];
    return downSampleData(mapped, 500);
  }, [chartData]);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {isLoading && dataValue.length < 0 ? (
        <CustomMainLoading variant="chart" />
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Data Pelanggaran Kendaraan
          </h2>

          <div className="flex justify-between rounded-md p-3 gap-5 mb-6 bg-gray-50">
            <div className="rounded-none w-xs">
              <CustomSelects
                value={
                  option.find((opt) => opt.value === selectedDevice) || null
                }
                onChange={(val) => handleDeviceSelect(val)}
                options={option}
                disabled={isLoading}
              />
            </div>
            <div className="text-center">
              <p className="text-gray-700">Traffic Data</p>
              <p className="text-gray-500 text-sm">{formattedMonthYear}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="bg-[#bde1e4] px-3 py-2 rounded-md">
              <input
                type="date"
                className="text-md text-gray-700"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>

            <div className="flex bg-[#bde1e4] rounded-xl overflow-hidden text-sm font-medium border border-[#63b1bb] text-black">
              {["day", "month", "year"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleFilterChange(t as any)}
                  className={`px-3 py-2 cursor-pointer ${
                    filterType === t ? "bg-[#63b1bb] font-semibold" : ""
                  } ${t !== "day" ? "border-l border-[#63b1bb]" : ""}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80">
            {dataValue && dataValue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataValue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval="preserveStartEnd"
                    tickFormatter={(val) =>
                      new Date(val).toLocaleDateString("id-ID", {
                        day: filterType === "year" ? undefined : "2-digit",
                        month: filterType !== "day" ? "short" : undefined,
                        year: "numeric",
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(val) =>
                      new Date(val).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="uv"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                No data available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
