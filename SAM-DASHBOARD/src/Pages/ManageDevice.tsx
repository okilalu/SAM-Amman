import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";

export default function ManageDevice() {
  const dummyData = [
    {
      id: 1,
      PortableDeviceId: "SAM01",
      DeviceAddress: "192.168.9.10",
      DeviceRootFolder: "/a",
      Location: "Supra",
    },
    {
      id: 2,
      PortableDeviceId: "SAM02",
      DeviceAddress: "192.168.8.10",
      DeviceRootFolder: "/b",
      Location: "Kuta",
    },
    {
      id: 3,
      PortableDeviceId: "SAM03",
      DeviceAddress: "192.168.7.10",
      DeviceRootFolder: "/c",
      Location: "Mataram",
    },
    {
      id: 4,
      PortableDeviceId: "SAM04",
      DeviceAddress: "192.168.10.10",
      DeviceRootFolder: "/d",
      Location: "KM01",
    },
  ];

  const [portable, setPortable] = useState(dummyData);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [sortDirection, SetSortDirection] = useState<"asc" | "desc">("asc");
  const [perPage, setPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    PortableDeviceId: "",
    DeviceAddress: "",
    DeviceRootFolder: "",
    Location: "",
  });

  const filteredDevice = portable
    .filter((item) =>
      item.PortableDeviceId.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortDirection === "asc"
        ? a.PortableDeviceId.localeCompare(b.PortableDeviceId)
        : b.PortableDeviceId.localeCompare(a.PortableDeviceId)
    );

  const handleOpenModal = (id: string, portable?: any) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();

    if (portable) {
      setFormData({
        PortableDeviceId: portable.PortableDeviceId,
        DeviceAddress: portable.DeviceAddress,
        DeviceRootFolder: portable.DeviceRootFolder,
        Location: portable.Location,
      });
    } else {
      setFormData({
        PortableDeviceId: "",
        DeviceAddress: "",
        DeviceRootFolder: "",
        Location: "",
      });
    }
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  const handleSelectPortable = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🟢 CREATE
  const handleRegister = () => {
    if (
      !formData.PortableDeviceId ||
      !formData.DeviceAddress ||
      !formData.DeviceRootFolder ||
      !formData.Location
    ) {
      alert("Lengkapi semua field!");
      return;
    }

    const newPortable = {
      id: portable.length + 1,
      PortableDeviceId: formData.PortableDeviceId,
      DeviceAddress: formData.DeviceAddress,
      DeviceRootFolder: formData.DeviceRootFolder,
      Location: formData.Location,
    };

    setPortable([...portable, newPortable]);
    handleCloseModal("modal_register");
  };

  // 🟡 UPDATE
  const handleUpdate = () => {
    if (selectedIds.length !== 1) {
      alert("Pilih tepat satu user untuk diupdate!");
      return;
    }

    const updated = portable.map((port) =>
      port.id === selectedIds[0] ? { ...port, ...formData } : port
    );
    setPortable(updated);
    setSelectedIds([]);
    handleCloseModal("modal_update");
  };

  // 🔴 DELETE
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert("Pilih user yang ingin dihapus terlebih dahulu!");
      return;
    }
    const deletePortable = portable.filter(
      (port) => !selectedIds.includes(port.id)
    );
    setPortable(deletePortable);
    setSelectedIds([]);
    handleCloseModal("modal_delete");
  };

  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100">
      <div className="flex-1 p-10 pt-12 text-sm text-black">
        {/* Breadcrumb */}
        <div className="breadcrumbs text-sm mb-4 p-3 bg-gray-200">
          <ul className="flex gap-2">
            <li>
              <a className="text-blue-600 hover:underline">Home</a>
            </li>
            <li>
              <a className="text-gray-800 font-semibold">Manage Device</a>
            </li>
          </ul>
        </div>
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
                <tr className="hover:bg-gray-50 text-center">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-error"
                      checked={selectedIds.includes(device.id)}
                      onChange={() => handleSelectPortable(device.id)}
                    />
                  </td>
                  <td>{device.PortableDeviceId}</td>
                  <td>{device.DeviceAddress}</td>
                  <td>{device.DeviceRootFolder}</td>
                  <td>{device.Location}</td>
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
            text="Add Device"
            onClick={() => handleOpenModal("modal_register")}
            className="btn-success"
          />
          <CustomButton
            text="Update"
            onClick={() => {
              const selectedUser = portable.find(
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
            title="Register Device"
            id="modal_register"
            confirmText="Register"
            onSubmit={handleRegister}
          >
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Portable Device ID"
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.PortableDeviceId}
                onChange={(e) =>
                  setFormData({ ...formData, PortableDeviceId: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Device Address"
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.DeviceAddress}
                onChange={(e) =>
                  setFormData({ ...formData, DeviceAddress: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Device Root Folder"
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.DeviceRootFolder}
                onChange={(e) =>
                  setFormData({ ...formData, DeviceRootFolder: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.Location}
                onChange={(e) =>
                  setFormData({ ...formData, Location: e.target.value })
                }
              />
            </div>
          </CustomModal>

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
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.PortableDeviceId}
                onChange={(e) =>
                  setFormData({ ...formData, PortableDeviceId: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Device Address"
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.DeviceAddress}
                onChange={(e) =>
                  setFormData({ ...formData, DeviceAddress: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Device Root Folder"
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.DeviceRootFolder}
                onChange={(e) =>
                  setFormData({ ...formData, DeviceRootFolder: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                value={formData.Location}
                onChange={(e) =>
                  setFormData({ ...formData, Location: e.target.value })
                }
              />
            </div>
          </CustomModal>
          <CustomModal
            title="Delete Device"
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
