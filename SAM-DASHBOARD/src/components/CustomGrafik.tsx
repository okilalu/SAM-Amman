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
import { useDeviceData } from "../hooks/useDeviceHooks";
import type { SelectOption } from "../../types/types";
import { CustomSelects } from "./CustomSelects";

export default function CustomGrafik() {
  const { chartData, handleGetAllFilter, isLoading } = useData();
  const { devices, fetchAllDevices } = useDeviceData({});
  const [samId, setSamId] = useState<string>("");
  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<SelectOption | null>(
    null
  );

  useEffect(() => {
    fetchAllDevices();
  }, []);

  useEffect(() => {
    if (devices.length > 0 && !samId) {
      const firstSamId = devices[0].samId || "";
      setSamId(firstSamId);
      setSelectedDevice({ label: firstSamId, value: firstSamId });
    }
  }, [devices]);

  const getDateRange = (type: "day" | "month" | "year", baseDate: string) => {
    const date = baseDate ? new Date(baseDate) : new Date();
    let startDate: Date;
    let endDate: Date;

    if (type === "day") {
      startDate = new Date(date);
      endDate = new Date(date);
    } else if (type === "month") {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    } else {
      startDate = new Date(date.getFullYear(), 0, 1);
      endDate = new Date(date.getFullYear(), 11, 31);
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const getFormattedMonthYear = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  const formattedMonthYear = getFormattedMonthYear(selectedDate);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);
    if (!samId) return;

    const { startDate, endDate } = getDateRange(filterType, dateValue);

    handleGetAllFilter({
      samId,
      filterType,
      filterValue: { startDate, endDate },
    } as any);
  };

  // === Handler untuk ganti filter ===
  const handleFilterChange = (type: "day" | "month" | "year") => {
    setFilterType(type);
    if (!samId) return;

    const { startDate, endDate } = getDateRange(
      type,
      selectedDate || new Date().toISOString()
    );

    handleGetAllFilter({
      samId,
      filterType: type,
      filterValue: { startDate, endDate },
    } as any);
  };

  const handleDeviceSelect = (selectedOption: SelectOption | null) => {
    setSelectedDevice(selectedOption);
    if (selectedOption) {
      setSamId(selectedOption.value);
      if (selectedDate) {
        const { startDate, endDate } = getDateRange(filterType, selectedDate);
        handleGetAllFilter({
          samId: selectedOption.value,
          filterType,
          filterValue: { startDate, endDate },
        } as any);
      }
    }
  };

  const option: SelectOption[] = Array.isArray(devices)
    ? devices.map((item) => ({
        label: item.samId || "",
        value: item.samId || "",
      }))
    : [];

  const downsampleData = (rawData: any[], maxPoints: number) => {
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
    return downsampleData(mapped, 500);
  }, [chartData]);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Data Pelanggaran Kendaraan
      </h2>

      <div className="flex justify-between rounded-md p-3 gap-5 mb-6 bg-gray-50">
        <div className="rounded-none w-xs">
          <CustomSelects
            value={selectedDevice}
            onChange={handleDeviceSelect}
            options={option}
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
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Loading data...
          </div>
        ) : dataValue && dataValue.length > 0 ? (
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
              {/* <Brush dataKey="name" height={30} stroke="#63b1bb" /> */}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
