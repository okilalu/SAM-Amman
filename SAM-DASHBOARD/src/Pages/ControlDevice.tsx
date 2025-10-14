import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";
import { useDeviceData } from "../hooks/useDeviceHooks";
import { useUserData } from "../hooks/useUserHooks";
import { useUserDeviceData } from "../hooks/useUserDeviceHooks";
import { CustomPagination } from "@/components/CustomPagination";
import { CustomSelect } from "@/components/CustomSelect";
import type { SingleValue } from "react-select";
import type { SelectOption } from "../../types/types";
import { CustomInputs } from "@/components/CustomInputs";

export default function ControlDevice() {
  const { devices, fetchAllDevices } = useDeviceData({});
  const { allUsers, validateAllUsers } = useUserData({});
  const { handleAddPermission, handleDeletePermission } = useUserDeviceData({});
  const [userId, setUserId] = useState("");
  const [deviceId, setDeviceId] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [sortDirection, SetSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [samId, setSamId] = useState("");
  const [selectOption, setSelectOption] = useState<string>("");

  const filteredUsers = (allUsers ?? [])
    .filter((u) =>
      (u.username ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortDirection === "asc"
        ? (a.id ?? 0) - (b.id ?? 0)
        : (b.id ?? 0) - (a.id ?? 0)
    );

  const filteredDevices = (devices ?? "")
    .filter((d) => (d.samId ?? "").toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) =>
      sortDirection === "asc"
        ? (a.samId ?? "").localeCompare(b.samId ?? "")
        : (b.samId ?? "").localeCompare(a.samId ?? "")
    );

  // Pagination
  const handlePageCHange = (page: number) => {
    setCurrentPage(page);
    console.log("Pindah ke halaman: ", page);
  };

  const paginatedUsers =
    filteredUsers &&
    filteredUsers!.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  // Modal control
  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  // Checkbox handler

  const handleSelectDevice = (id: string) => {
    setDeviceId((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Add Access
  const handlePermission = async () => {
    if (!userId) {
      alert("Pilih user terlebih dahulu!");
      return;
    }
    if (deviceId.length === 0) {
      alert("Pilih device terlebih dahulu!");
      return;
    }
    setIsProcessing(true);
    try {
      await handleAddPermission({ userId, deviceId });
      handleCloseModal("modal_register");

      setUserId("");
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete Access
  const handleRevokePermission = async () => {
    if (selectedIds.length === 0) {
      alert("Pilih user yang ingin dicabut aksesnya!");
      return;
    }
    setIsProcessing(true);
    try {
      for (const id of deviceId) {
        await handleDeletePermission({ userId, deviceId: id });
      }
      setSelectedIds([]);
      handleCloseModal("modal_delete");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllDevices();
  }, []);

  useEffect(() => {
    validateAllUsers();
  }, []);

  const handleSelectOption = (selected: SingleValue<SelectOption>) => {
    setSelectOption(selected ? selected.value : "");
  };

  const option = [
    {
      label: "Asc",
      value: "asc",
    },
    {
      label: "Desc",
      value: "desc",
    },
  ];

  return (
    <div className="gap-3">
      <div className="flex-1 gap-5 text-sm text-black flex overflow-auto">
        <div className="flex-1 bg-white shadow rounded-sm p-3 pt-0">
          <div className="flex items-center gap-5 justify-between p-3">
            <div className="flex flex-col gap-5 flex-1">
              <CustomInputs
                label="Filter"
                placeholder="Masukkan username"
                onChange={(val) => setFilter(val)}
                helperText="x"
                helper={() => setFilter("")}
                value={filter}
              />

              <CustomSelect
                values={
                  option.find((opt) => opt.value === selectOption) || null
                }
                handleChange={handleSelectOption}
                options={option}
                label="Sort"
                flex="flex-row"
                labelClass="items-center gap-3"
              />
            </div>
            <div className="flex flex-col gap-5 flex-1">
              <CustomInputs
                label="Sort"
                placeholder="Masukkan device portable"
                onChange={(val) => setSort(val)}
                helperText="x"
                helper={() => setSort("")}
                value={sort}
              />
              <CustomInputs
                label="Per Page"
                placeholder="Masukkan jumlah page"
                onChange={(val) => setItemsPerPage(Number(val))}
                value={Number(itemsPerPage)}
                type="number"
              />
            </div>
          </div>

          <div className="pt-5 flex flex-col gap-3">
            <div className="min-h-[250px]">
              <CustomTable headers={["Select", "UserId", "UserName"]}>
                {paginatedUsers && paginatedUsers.length > 0 ? (
                  paginatedUsers.map((item, idx) => (
                    <tr
                      key={item.userId}
                      className="hover:bg-gray-50 text-center"
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-neutral"
                          checked={userId.includes(item.userId!)}
                          onChange={() => setUserId(item.userId!)}
                        />
                      </td>
                      <td>{idx + 1}</td>
                      <td>{item.username}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-4">
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                )}
              </CustomTable>
            </div>

            {/* 👇 Pagination tetap di bawah */}
            <CustomPagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={allUsers ? allUsers!.length : 0}
              onPageChange={handlePageCHange}
            />
          </div>
        </div>

        <div className="flex-1">
          <CustomTable headers={["Select", "PortableDeviceId", "LocationName"]}>
            {filteredDevices.length > 0 ? (
              filteredDevices.map((item) => (
                <tr className="hover:bg-gray-50 text-center">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-error"
                      checked={deviceId.includes(item.deviceId!)}
                      onChange={() => handleSelectDevice(item.deviceId!)}
                    />
                  </td>
                  <td>{item.samId}</td>
                  <td>{item.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  Tidak ada data ditemukan
                </td>
              </tr>
            )}
          </CustomTable>

          <div className="pt-5 flex gap-3 justify-end">
            <CustomButton
              text="Add Access"
              onClick={() => handleOpenModal("modal_register")}
              className="btn-success"
            />
            <CustomButton
              text="Delete"
              onClick={() => handleOpenModal("modal_delete")}
              className="btn-error"
            />
          </div>

          <div>
            <CustomModal
              title="Register New Location"
              id="modal_register"
              confirmText={isProcessing ? "Processing..." : "OK"}
              onSubmit={handlePermission}
            >
              <p>
                Apakah anda akan memberikan akses ke user{" "}
                <strong>{selectedIds.length}</strong> untuk mendapatkan
                activitas dari Portable Device Id <strong>{samId}</strong> ?
              </p>
            </CustomModal>

            <CustomModal
              title="Delete"
              id="modal_delete"
              confirmText={isProcessing ? "Processing..." : "OK"}
              onSubmit={handleRevokePermission}
            >
              <div className="flex flex-col">
                <p>
                  Apakah anda akan mencabut akses ke user{" "}
                  <strong>{selectedIds.length}</strong> untuk mendapatkan
                  activitas dari Portable Device Id <strong>{samId}</strong> ?
                </p>
              </div>
            </CustomModal>
          </div>
        </div>
      </div>
    </div>
  );
}
