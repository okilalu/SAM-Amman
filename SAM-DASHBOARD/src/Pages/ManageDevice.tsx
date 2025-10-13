import { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";
import { useDeviceData } from "../hooks/useDeviceHooks";
import { useLocationData } from "../hooks/useLocationHooks";

export default function ManageDevice() {
  const {
    handleGenerateDevice,
    fetchAllDevices,
    devices,
    handleUpdateDevice,
    handleDeleteDevice,
  } = useDeviceData({});
  const { locations, fetchAllLocations } = useLocationData({});

  // === STATE ===
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
  const [sortDirection, SetSortDirection] = useState<"asc" | "desc">("asc");
  const [perPage, setPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = 5;
  const [loading, setLoading] = useState<boolean>(false);

  // === FILTER DATA ===
  const filteredDevice = (devices ?? [])
    .filter((item) =>
      (item.samId ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortDirection === "asc"
        ? (a.samId ?? "").localeCompare(b.samId ?? "")
        : (b.samId ?? "").localeCompare(a.samId ?? "")
    );

  // === MODAL HANDLER ===
  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  // === SELECT CHECKBOX ===
  const handleSelectPortable = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Pindah ke halaman: ", page);
  };

  // 🟢 CREATE DEVICE
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
        location, // lokasi diambil dari dropdown
      });

      handleCloseModal("modal_register");
      await fetchAllDevices();

      // reset field
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

  // 🟡 UPDATE DEVICE
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

  // 🔴 DELETE DEVICE
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

  // === FETCH DATA ===
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAllDevices();
      await fetchAllLocations();
      setLoading(false);
    };
    loadData();
  }, []);

  // === PREFILL UPDATE FORM ===
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

  return (
    <div className="flex gap-3 min-h-screen">
      <div className="flex-1 text-sm text-black">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Manage Device</h2>

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

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <span className="loading loading-bars loading-xl text-blue-400"></span>
            <p className="ml-3 text-gray-700 text-lg">
              Memuat data perangkat...
            </p>
          </div>
        ) : (
          <>
            <div className="pt-5">
              <CustomTable
                headers={[
                  "Select",
                  "PortableDeviceId",
                  "DeviceAddress",
                  "DeviceRootFolder",
                  "Location",
                ]}
              >
                {filteredDevice.length > 0 ? (
                  filteredDevice.map((device) => (
                    <tr
                      key={device.samId}
                      className="hover:bg-gray-50 text-center"
                    >
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

            <Pagination
              currentPage={currentPage}
              totalPage={totalPage}
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

                {/* Dropdown lokasi */}
                <select
                  className="select w-full bg-gray-200 mb-3"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">-- Pilih Lokasi --</option>
                  {Array.isArray(locations) && locations.length > 0 ? (
                    locations.map((item, idx) => (
                      <option key={idx} value={item.location}>
                        {item.location}
                      </option>
                    ))
                  ) : (
                    <option disabled>Tidak ada data lokasi</option>
                  )}
                </select>
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

                {/* Dropdown lokasi untuk update */}
                <select
                  className="select w-full bg-gray-200 mb-3"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">-- Pilih Lokasi --</option>
                  {Array.isArray(locations) && locations.length > 0 ? (
                    locations.map((item, idx) => (
                      <option key={idx} value={item.location}>
                        {item.location}
                      </option>
                    ))
                  ) : (
                    <option disabled>Tidak ada data lokasi</option>
                  )}
                </select>
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
