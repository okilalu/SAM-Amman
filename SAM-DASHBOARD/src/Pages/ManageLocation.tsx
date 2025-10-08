import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";

export default function ManageLocation() {
  const dummyData = [
    { id: 1, LocationId: "SAM01", LocationName: "Supra" },
    { id: 2, LocationId: "SAM02", LocationName: "KM 01" },
    { id: 3, LocationId: "SAM03", LocationName: "Mataram" },
  ];

  const [location, setLocation] = useState(dummyData);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [sortDirection, SetSortDirection] = useState<"asc" | "desc">("asc");
  const [perPage, setPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    LocationId: "",
    LocationName: "",
  });

  const filteredDevice = location
    .filter((item) =>
      item.LocationId.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortDirection === "asc"
        ? a.LocationId.localeCompare(b.LocationId)
        : b.LocationId.localeCompare(a.LocationId)
    );

  const handleOpenModal = (id: string, location?: any) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();

    if (location) {
      setFormData({
        LocationId: location.LocationId,
        LocationName: location.LocationName,
      });
    } else {
      setFormData({ LocationId: "", LocationName: "" });
    }
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  const handleSelectUser = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRegister = () => {
    if (!formData.LocationId || !formData.LocationName) {
      alert("Lengkapi semua field!");
      return;
    }

    const newLocation = {
      id: location.length + 1,
      LocationId: formData.LocationId,
      LocationName: formData.LocationName,
    };

    setLocation([...location, newLocation]);
    handleCloseModal("modal_register");
  };

  const handleUpdate = () => {
    if (selectedIds.length !== 1) {
      alert("Pilih tepat satu user untuk diupdate!");
      return;
    }

    const updated = location.map((loc) =>
      loc.id === selectedIds[0] ? { ...loc, ...formData } : loc
    );
    setLocation(updated);
    setSelectedIds([]);
    handleCloseModal("modal_update");
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert("Pilih user yang ingin dihapus terlebih dahulu!");
      return;
    }
    const deleteLoc = location.filter((loc) => !selectedIds.includes(loc.id));
    setLocation(deleteLoc);
    setSelectedIds([]);
    handleCloseModal("modal_delete");
  };

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

        <div className="pt-5">
          <CustomTable headers={["Select", "LocationId", "LocationName"]}>
            {filteredDevice && filteredDevice.length > 0 ? (
              filteredDevice.map((item) => (
                <tr className="hover:bg-gray-50 text-center">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-error"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectUser(item.id)}
                    />
                  </td>
                  <td>{item.LocationId}</td>
                  <td>{item.LocationName}</td>
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

        <Pagination />

        <div className="pt-5 flex gap-3 justify-end">
          <CustomButton
            text="Add Location"
            onClick={() => handleOpenModal("modal_register")}
            className="btn-success"
          />
          <CustomButton
            text="Update"
            onClick={() => {
              const selectedUser = location.find(
                (u) => u.id === selectedIds[0]
              );
              if (selectedUser) handleOpenModal("modal_update", selectedUser);
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
                value={formData.LocationId}
                onChange={(e) =>
                  setFormData({ ...formData, LocationId: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location Name"
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.LocationName}
                onChange={(e) =>
                  setFormData({ ...formData, LocationName: e.target.value })
                }
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
                value={formData.LocationId}
                onChange={(e) =>
                  setFormData({ ...formData, LocationId: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Enter You Password"
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.LocationName}
                onChange={(e) =>
                  setFormData({ ...formData, LocationName: e.target.value })
                }
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
              <p className="">Apakah anda yakin ingin menghapus data ini?</p>
            </div>
          </CustomModal>
        </div>
      </div>
    </div>
  );
}
