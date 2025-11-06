import { useCallback, useEffect, useState } from "react";
import { useData } from "../hooks/useDataHooks";
import type { Datas, SelectOption } from "../../types/types";
import { CustomInputs } from "@/components/CustomInputs";
import { CustomSelects } from "@/components/CustomSelects";
import { CustomPagination } from "@/components/CustomPagination";
import { useUserDeviceData } from "@/hooks/useUserDeviceHooks";
import { CustomMainLoading } from "@/components/CustomMainLoading";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Portable() {
  const { data, handleFilterData, handleGetAllData, isLoading } = useData();
  const { accessible, fetchAllAccessible } = useUserDeviceData({});

  const options: SelectOption[] =
    accessible?.map((item) => ({
      label: item.samId || "",
      value: item.samId || "",
    })) || [];

  const [startDate, setStartDate] = useState("2025-10-16");
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [speedFrom, setSpeedFrom] = useState<number>(1);
  const [speedTo, setSpeedTo] = useState<number>(99);
  const [status, setStatus] = useState<"all" | "over speed">("all");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // const [device, setDevice] = useState();

  useEffect(() => {
    fetchAllAccessible();
  }, []);

  useEffect(() => {
    if (accessible.length > 0 && !selectedDevice) {
      setSelectedDevice(accessible[0].samId || null);
    }
  }, [accessible, selectedDevice]);

  const handleSearch = useCallback(() => {
    if (!selectedDevice) return;
    handleFilterData({
      samId: selectedDevice,
      data: {
        minSpeed: speedFrom,
        maxSpeed: speedTo,
        startDate,
        endDate,
        category: status,
      } as unknown as Datas,
    });
  }, [
    selectedDevice,
    speedFrom,
    speedTo,
    startDate,
    endDate,
    status,
    handleFilterData,
  ]);

  const handleChangeStatus = useCallback(
    (val: string) => {
      if (!selectedDevice) return;

      const newStatus = val === "over speed" ? "over speed" : "all";
      setStatus(newStatus);

      handleFilterData({
        samId: selectedDevice,
        data: {
          minSpeed: speedFrom,
          maxSpeed: speedTo,
          startDate,
          endDate,
          category: newStatus,
        } as unknown as Datas,
      });
    },
    [selectedDevice, speedFrom, speedTo, startDate, endDate, handleFilterData]
  );

  const handleClear = async () => {
    setStartDate("");
    setEndDate("");
    setSpeedFrom(0);
    setSpeedTo(0);
    setStatus("all");

    if (selectedDevice) {
      await handleGetAllData({ samId: selectedDevice });
    }
  };

  useEffect(() => {
    if (selectedDevice) handleGetAllData({ samId: selectedDevice });
  }, [selectedDevice]);

  const handleDeviceSelect = (val: string | null) => {
    setSelectedDevice(val);
  };

  const paginatedDatas = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleExportExcel = () => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diexport.");
      return;
    }

    const exportData = data.map((item, index) => ({
      No: index + 1,
      Portable_Name: item.samId,
      Log_Time: new Date(item.createdAt as string).toLocaleString(),
      Over_Speed: item.category === "over speed" ? "TRUE" : "FALSE",
      Speed: item.speed,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    console.log(excelBuffer);

    const filename = `data_viewer_${selectedDevice}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    saveAs(file, filename);
  };

  return (
    <div className="flex flex-col gap-3 w-full text-black">
      <div className="flex-1 text-sm">
        {/* Filter Section */}
        <div className="bg-white shadow rounded-xl p-4 sm:p-6 mb-8 w-full">
          <div className="flex flex-col lg:flex-row gap-6 justify-between">
            {/* Left Column */}
            <div className="flex flex-col gap-5 flex-1">
              <CustomInputs
                label="Start date"
                placeholder="Masukkan start date"
                value={startDate}
                onChange={(val) => setStartDate(String(val))}
                type="date"
              />
              <CustomInputs
                label="Speed"
                placeholder="Masukkan speed"
                value={speedFrom}
                onChange={(val) => setSpeedFrom(Number(val))}
                type="number"
              />
              <div className="flex border border-[#63b1bb] rounded-xl overflow-hidden cursor-pointer self-center sm:self-center">
                <button
                  onClick={() => handleChangeStatus("all")}
                  className={`px-5 sm:px-6 py-2 font-semibold ${
                    status === "all"
                      ? "bg-[#63b1bb] text-white"
                      : "hover:bg-[#63b1bb] hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleChangeStatus("over speed")}
                  className={`px-5 sm:px-6 py-2 font-semibold ${
                    status === "over speed"
                      ? "bg-[#63b1bb] text-white"
                      : "hover:bg-[#63b1bb] hover:text-white"
                  }`}
                >
                  Overspeed
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-5 flex-1">
              <CustomInputs
                label="End date"
                placeholder="Masukkan end date"
                value={endDate}
                onChange={(val) => setEndDate(String(val))}
                type="date"
              />
              <CustomInputs
                label="Max speed"
                placeholder="Max speed"
                value={speedTo}
                onChange={(val) => setSpeedTo(Number(val))}
                type="number"
              />
              <CustomSelects
                value={
                  options.find((opt) => opt.value === selectedDevice) ?? null
                }
                onChange={(val) => handleDeviceSelect(val)}
                options={options}
                label="Device"
                flex="flex-row"
                labelClass="items-center gap-3"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-between mt-6">
            <div className="flex flex-col justify-center sm:justify-start">
              <button
                onClick={handleExportExcel}
                className="btn bg-[#00d491] shadow-none border-none px-10 text-white"
              >
                Create Excel
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-end">
              <button
                onClick={handleClear}
                className="btn bg-transparent border border-[#63b1bb] shadow-none text-[#63b1bb] px-10"
              >
                Clear
              </button>
              <button
                onClick={handleSearch}
                className="btn bg-[#63b1bb] shadow-none border-none px-10 text-white"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow rounded-xl p-4 sm:p-6 w-full overflow-x-auto">
          {isLoading && paginatedDatas.length < 0 ? (
            <CustomMainLoading variant="table" menuLines={itemsPerPage} />
          ) : paginatedDatas.length > 0 ? (
            <table className="table w-full text-sm text-center border-collapse">
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Speed</th>
                  <th className="p-3">DeviceId</th>
                  <th className="p-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDatas.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.createdAt}</td>
                    <td className="p-3">{item.speed} km/h</td>
                    <td className="p-3">{item.samId}</td>
                    <td className="p-3">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-5 text-center text-gray-500 border border-dashed rounded-lg">
              No data to show
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 sm:mt-6">
          <CustomPagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={data.length}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
