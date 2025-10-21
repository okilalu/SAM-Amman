import { useEffect, useMemo, useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";
import { useDeviceData } from "../hooks/useDeviceHooks";
import { useLocationData } from "../hooks/useLocationHooks";
import { CustomInputs } from "@/components/CustomInputs";
import { CustomSelects } from "@/components/CustomSelects";
import { CustomPagination } from "@/components/CustomPagination";

export default function ManageDevice() {
  const {
    handleGenerateDevice,
    fetchAllDevices,
    devices,
    handleUpdateDevice,
    handleDeleteDevice,
  } = useDeviceData({});
  const { locations, fetchAllLocations } = useLocationData({});
  const [samId, setSamId] = useState("");
  const [deviceIP, setDeviceIP] = useState("");
  const [deviceUsername, setDeviceUsername] = useState("");
  const [deviceRootFolder, setDeviceRootFolder] = useState("");
  const [cameraIP, setCameraIP] = useState("");
  const [cameraUsername, setCameraUsername] = useState("");
  const [cameraPassword, setCameraPassword] = useState("");
  const [cameraRootFolder, setCameraRootFolder] = useState("");
  const [cameraType, setCameraType] = useState("");
  const [location, setLocation] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [selectOption, setSelectOption] = useState<string>("asc");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  const filteredDevice = (devices ?? [])
    .filter((item) =>
      (item.samId ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      selectOption === "asc"
        ? (a.samId ?? "").localeCompare(b.samId ?? "")
        : (b.samId ?? "").localeCompare(a.samId ?? "")
    );

  const paginatedUsers = filteredDevice.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  const handleSelectPortable = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRegister = async () => {
    if (
      !samId ||
      !deviceIP ||
      !deviceUsername ||
      !deviceRootFolder ||
      !cameraIP ||
      !cameraUsername ||
      !cameraPassword ||
      !cameraRootFolder ||
      !cameraType ||
      !location
    ) {
      alert("Lengkapi semua field!");
      return;
    }

    try {
      setLoading(true);
      await handleGenerateDevice({
        samId,
        deviceIP,
        deviceUsername,
        deviceRootFolder,
        cameraIP,
        cameraUsername,
        cameraPassword,
        cameraRootFolder,
        cameraType,
        location,
      });

      handleCloseModal("modal_register");
      await fetchAllDevices();

      setSamId("");
      setDeviceIP("");
      setDeviceUsername("");
      setDeviceRootFolder("");
      setCameraIP("");
      setCameraUsername("");
      setCameraPassword("");
      setCameraRootFolder("");
      setCameraType("");
      setLocation("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (selectedIds.length !== 1) {
      alert("Pilih tepat satu device untuk diupdate!");
      return;
    }

    const selectedId = selectedIds[0];
    const selectedDevice = devices?.find((d) => d.samId === selectedId);

    if (!selectedDevice) {
      alert("Device tidak ditemukan!");
      return;
    }

    try {
      setLoading(true);
      await handleUpdateDevice(String(selectedDevice.deviceId!), {
        samId,
        deviceIP,
        deviceUsername,
        deviceRootFolder,
        cameraIP,
        cameraUsername,
        cameraPassword,
        cameraRootFolder,
        cameraType,
        location,
      });

      handleCloseModal("modal_update");
      await fetchAllDevices();
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Pilih device yang ingin dihapus!");
      return;
    }
    try {
      setLoading(true);
      await handleDeleteDevice({ id: String(selectedIds) });
      alert(`${selectedIds.length} Device berhasil dihapus.`);
      handleCloseModal("modal_delete");
      setSelectedIds([]);
      await fetchAllDevices();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAllDevices();
      await fetchAllLocations();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSelectOption = (selected: string) => {
    setSelectOption(selected);
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

  const handlePrefillUpdate = () => {
    if (selectedIds.length !== 1) {
      alert("Pilih satu device untuk diupdate!");
      return;
    }
    const selectedDevice = devices?.find((u) => u.samId === selectedIds[0]);
    if (!selectedDevice) return alert("Device tidak ditemukan!");
    setSamId(selectedDevice.samId || "");
    setDeviceIP(selectedDevice.deviceIP || "");
    setDeviceUsername(selectedDevice.deviceUsername || "");
    setDeviceRootFolder(selectedDevice.deviceRootFolder || "");
    setCameraIP(selectedDevice.cameraIP || "");
    setCameraUsername(selectedDevice.cameraUsername || "");
    setCameraPassword(selectedDevice.cameraPassword || "");
    setCameraRootFolder(selectedDevice.cameraRootFolder || "");
    setCameraType(selectedDevice.cameraType || "");
    setLocation(selectedDevice.location || "");
    handleOpenModal("modal_update");
  };

  const locationsOption = useMemo(
    () =>
      locations
        .filter((d) => d.location && d.location.trim() !== "")
        .map((d) => ({
          value: d.location!,
          label: d.location!,
        })),
    [locations]
  );

  return (
    <div className="flex gap-3">
      <div className="flex-1 text-sm text-black">
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

            <CustomSelects
              value={option.find((opt) => opt.value === selectOption) || null}
              onChange={handleSelectOption}
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

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <span className="loading loading-bars loading-xl text-blue-400"></span>
            <p className="ml-3 text-gray-700 text-lg">
              Memuat data perangkat...
            </p>
          </div>
        ) : (
          <>
            <div className="pt-5 min-h-[270px] ">
              <CustomTable
                headers={[
                  "Select",
                  "PortableDeviceId",
                  "DeviceAddress",
                  "DeviceRootFolder",
                  "Location",
                ]}
              >
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((device, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 text-center">
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          checked={selectedIds.includes(device.samId!)}
                          onChange={() => handleSelectPortable(device.samId!)}
                        />
                      </td>
                      <td>{device.samId}</td>
                      <td>{device.deviceIP}</td>
                      <td>{device.deviceRootFolder}</td>
                      <td>{device.location}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-4">
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                )}
              </CustomTable>
            </div>

            <CustomPagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={devices ? devices!.length : 0}
              onPageChange={handlePageChange}
            />

            <div className="pt-5 flex gap-3 justify-end">
              <CustomButton
                text="Add Device"
                onClick={() => handleOpenModal("modal_register")}
                className="btn-success"
              />
              <CustomButton
                text="Update"
                onClick={handlePrefillUpdate}
                className="btn-info"
              />
              <CustomButton
                text="Delete"
                onClick={() => handleOpenModal("modal_delete")}
                className="btn-error"
              />
            </div>

            {/* === MODAL REGISTER === */}
            <CustomModal
              title="Register Device"
              id="modal_register"
              confirmText="Register"
              onSubmit={handleRegister}
            >
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Portable Device ID"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={samId}
                  onChange={(e) => setSamId(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Device Address"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={deviceIP}
                  onChange={(e) => setDeviceIP(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Device Username"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={deviceUsername}
                  onChange={(e) => setDeviceUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Device Root Folder"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={deviceRootFolder}
                  onChange={(e) => setDeviceRootFolder(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera IP"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraIP}
                  onChange={(e) => setCameraIP(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera Username"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraUsername}
                  onChange={(e) => setCameraUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera Password"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraPassword}
                  onChange={(e) => setCameraPassword(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera Root Folder"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraRootFolder}
                  onChange={(e) => setCameraRootFolder(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera Type"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraType}
                  onChange={(e) => setCameraType(e.target.value)}
                />

                <CustomSelects
                  value={
                    locationsOption.find((opt) => opt.value === location) ||
                    null
                  }
                  onChange={(val) => setLocation(val)}
                  options={locationsOption}
                  flex="flex-row"
                  background="bg-gray-200 border-none text-black"
                />
              </div>
            </CustomModal>

            {/* === MODAL UPDATE === */}
            <CustomModal
              title="Update Device"
              id="modal_update"
              confirmText="Update"
              onSubmit={handleUpdate}
            >
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Portable Device ID"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={samId}
                  onChange={(e) => setSamId(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Device Address"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={deviceIP}
                  onChange={(e) => setDeviceIP(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Device Username"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={deviceUsername}
                  onChange={(e) => setDeviceUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Device Root Folder"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={deviceRootFolder}
                  onChange={(e) => setDeviceRootFolder(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera IP"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraIP}
                  onChange={(e) => setCameraIP(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera Username"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraUsername}
                  onChange={(e) => setCameraUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera Password"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraPassword}
                  onChange={(e) => setCameraPassword(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera Root Folder"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraRootFolder}
                  onChange={(e) => setCameraRootFolder(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Camera Type"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2"
                  value={cameraType}
                  onChange={(e) => setCameraType(e.target.value)}
                />

                <CustomSelects
                  value={
                    locationsOption.find((opt) => opt.value === location) ||
                    null
                  }
                  onChange={(val) => setLocation(val)}
                  options={locationsOption}
                  flex="flex-row"
                  background="bg-gray-200 border-none text-black"
                />
              </div>
            </CustomModal>

            {/* === MODAL DELETE === */}
            <CustomModal
              title="Delete Device"
              id="modal_delete"
              confirmText="Delete"
              onSubmit={handleDelete}
            >
              <p>Apakah Anda yakin ingin menghapus data ini?</p>
            </CustomModal>
          </>
        )}
      </div>
    </div>
  );
}
