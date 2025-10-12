import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";
import { useDeviceData } from "../hooks/useDeviceHooks";

export default function ManageLocation() {
  // const dummyData = [
  //   { id: 1, LocationId: "SAM01", LocationName: "Supra" },
  //   { id: 2, LocationId: "SAM02", LocationName: "KM 01" },
  //   { id: 3, LocationId: "SAM03", LocationName: "Mataram" },
  // ];

  // const [location, setLocation] = useState(dummyData);
  const {
    fetchAllDevices,
    devices,
    handleUpdateDevice,
    handleDeleteDevice,
    handleGenerateDevice,
  } = useDeviceData({});
  const [filter, setFilter] = useState("");
  const [samId, setSamId] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  const [sortDirection, SetSortDirection] = useState<"asc" | "desc">("asc");
  const [perPage, setPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = 5;
  const [loading, setLoading] = useState<boolean>(false);

  const filteredDevice = (devices ?? [])
    .filter((item) =>
      (item.samId ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortDirection === "asc"
        ? (a.samId ?? "").localeCompare(b.samId ?? "")
        : (b.samId ?? "").localeCompare(a.samId ?? "")
    );

  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  const handleSelectUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Pagination
  const handlePageCHange = (page: number) => {
    setCurrentPage(page);
    console.log("Pindah ke halaman: ", page);
  };

  const handleRegister = async () => {
    if (!samId || !location) {
      alert("Lengkapi semua field!");
      return;
    }
    try {
      setLoading(true);
      await handleGenerateDevice({
        samId,
        location,
      });

      handleCloseModal("modal_register");

      setSamId("");
      setLocation("");
      console.log(handleGenerateDevice);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (selectedIds.length !== 1) {
      alert("Pilih tepat satu user untuk diupdate!");
      return;
    }
    const selectedId = selectedIds[0];
    const selectedDevice = devices?.find((d) => d.samId === selectedId);
    console.log(selectedDevice);

    try {
      setLoading(true);
      const payload = {
        samId,
        location,
      };
      await handleUpdateDevice(selectedDevice!.deviceId!, payload);

      handleCloseModal("modal_update");
      fetchAllDevices();
      setSelectedIds([]);
      console.log(handleUpdateDevice);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Pilih user yang ingin dihapus terlebih dahulu!");
      return;
    }
    try {
      setLoading(true);
      await handleDeleteDevice({ id: String(selectedIds) });

      handleCloseModal("modal_delete");
      setSelectedIds([]);
      fetchAllDevices();
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
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100">
      <div className="flex-1 p-10 pt-12 text-sm text-black">
        {/* Breadcrumb */}
        <div className="breadcrumbs text-sm mb-4  p-3 bg-gray-200">
          <ul className="flex gap-2">
            <li>
              <a className="text-blue-600 hover:underline">Home</a>
            </li>
            <li>
              <a className="text-gray-800 font-semibold">Manage Location</a>
            </li>
          </ul>
        </div>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Manage Location
        </h2>

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
            <span className="loading loading-bars loading-xl text-blue-400 "></span>
            <p className="ml-3 text-gray-700 text-lg">
              Memuat data perangkat...
            </p>
          </div>
        ) : (
          <>
            <div className="pt-5">
              <CustomTable headers={["Select", "LocationId", "LocationName"]}>
                {filteredDevice && filteredDevice.length > 0 ? (
                  filteredDevice.map((item) => (
                    <tr className="hover:bg-gray-50 text-center">
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          checked={selectedIds.includes(item.samId!)}
                          onChange={() => handleSelectUser(item.samId!)}
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
            </div>

            <Pagination
              currentPage={currentPage}
              totalPage={totalPage}
              onPageChange={handlePageCHange}
            />

            <div className="pt-5 flex gap-3 justify-end">
              <CustomButton
                text="Add Location"
                onClick={() => handleOpenModal("modal_register")}
                className="btn-success"
              />
              <CustomButton
                text="Update"
                onClick={() => {
                  const selectedUser = devices.find(
                    (u) => u.samId === selectedIds[0]
                  );
                  if (selectedUser) handleOpenModal("modal_update");
                  else alert("Pilih user terlebih dahulu!");
                }}
                className="btn-info"
              />
              <CustomButton
                text="Delete"
                onClick={() => handleOpenModal("modal_delete")}
                className="btn-error"
              />
            </div>

            <div className="pt-5">
              <CustomModal
                title="Register New Location"
                id="modal_register"
                confirmText="Register"
                onSubmit={handleRegister}
              >
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Location ID"
                    className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                    value={samId}
                    onChange={(e) => setSamId(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Location Name"
                    className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </CustomModal>

              <CustomModal
                title="Update Location"
                id="modal_update"
                confirmText="Update"
                onSubmit={handleUpdate}
              >
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Enter You Username"
                    className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                    value={samId}
                    onChange={(e) => setSamId(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enter You Password"
                    className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </CustomModal>

              <CustomModal
                title="Delete Location"
                id="modal_delete"
                confirmText="Delete"
                onSubmit={handleDelete}
              >
                <div className="flex flex-col">
                  <p className="">
                    Apakah anda yakin ingin menghapus data ini?
                  </p>
                </div>
              </CustomModal>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
