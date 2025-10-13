import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";
import { useDeviceData } from "../hooks/useDeviceHooks";
import { useUserData } from "../hooks/useUserHooks";
import { useUserDeviceData } from "../hooks/useUserDeviceHooks";

export default function ControlDevice() {
  const { devices, fetchAllDevices } = useDeviceData({});
  const { allUsers, validateAllUsers } = useUserData({});
  const { permissions, handleAddPermission, handleDeletePermission } =
    useUserDeviceData({});
  const [userId, setUserId] = useState("");
  const [deviceId, setDeviceId] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [sortDirection, SetSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = 5;
  const [isProcessing, setIsProcessing] = useState(false);
  const [samId, setSamId] = useState("");

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

  const itemsPerPage = filteredUsers.slice(
    (currentPage - 1) * totalPage,
    currentPage * totalPage
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
      await handleDeletePermission({ userId, deviceId });
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
  console.log(userId, deviceId);

  return (
    <div className="flex gap-3 min-h-screen pt-7 bg-gray-100 ">
      <div className="flex-1 p-10 pt-12  text-sm text-black">
        <div className="breadcrumbs bg-gray-200 p-3">
          <div className="divider divider-horizontal" />
          <ul>
            <li>
              <a href="" className="text-blue-600">
                Home
              </a>
            </li>
            <li>
              <a href="">Control Device</a>
            </li>
          </ul>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 pt-5">
          Control Device
        </h2>

        <div className="pt-5 bg-white shadow  rounded-sm p-3">
          <CustomInput
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            sortDirection={sortDirection}
            setSortDirection={SetSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            labels={{
              filter: "Filter",
              sort: " Sort",
              sortDirection: "Sort Direction",
              perPage: "Per Page",
            }}
            placeholder={{
              filter: "Masukkan ID Device",
              sort: "Contoh: PortableDeviceId",
            }}
          />

          <div className="pt-5">
            <CustomTable headers={["Select", "UserId", "UserName"]}>
              {itemsPerPage.length > 0 ? (
                itemsPerPage.map((item, idx) => (
                  <tr className="hover:bg-gray-50 text-center">
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

            <Pagination
              currentPage={currentPage}
              totalPage={totalPage}
              onPageChange={handlePageCHange}
            />
          </div>
        </div>

        <div className="p-3 mt-6">
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
