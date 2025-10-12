import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";

export default function ControlDevice() {
  const [devices, setDevices] = useState([
    { id: 1, PortableDeviceId: "SAM01", LocationName: "Supra" },
    { id: 2, PortableDeviceId: "SAM02", LocationName: "KM 01" },
    { id: 3, PortableDeviceId: "SAM03", LocationName: "Mataram" },
  ]);
  const dummyDataUser = [
    {
      UserId: "1",
      UserName: "admin",
    },
    {
      UserId: "2",
      UserName: "guest",
    },
    {
      UserId: "3",
      UserName: "admin",
    },
    {
      UserId: "4",
      UserName: "safety_speed",
    },
    {
      UserId: "5",
      UserName: "safety_ops",
    },
  ];

  // const [portable, setPortable] = useState(dummyDataUser);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [sortDirection, SetSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    PortableDeviceId: "",
    LocationName: "",
  });
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = 5;

  const filteredUsers = dummyDataUser
    .filter((u) => u.UserId.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) =>
      sortDirection === "asc"
        ? a.UserId.localeCompare(b.UserId)
        : b.UserId.localeCompare(a.UserId)
    );

  const filteredDevices = devices
    .filter((d) =>
      d.PortableDeviceId.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      sortDirection === "asc"
        ? a.PortableDeviceId.localeCompare(b.PortableDeviceId)
        : b.PortableDeviceId.localeCompare(a.PortableDeviceId)
    );

  // Pagination
  const handlePageCHange = (page: number) => {
    setCurrentPage(page);
    console.log("Pindah ke halaman: ", page);
  };

  // 🔹 Modal control
  const handleOpenModal = (id: string, portable?: any) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();

    if (portable) {
      setFormData({
        PortableDeviceId: portable.PortableDeviceId,
        LocationName: portable.LocationName,
      });
    } else {
      setFormData({ PortableDeviceId: "", LocationName: "" });
    }
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  // 🔸 Checkbox handler
  const handleSelectUser = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🟢 CREATE
  const handleRegister = () => {
    if (!formData.PortableDeviceId || !formData.LocationName) {
      alert("Lengkapi semua field!");
      return;
    }

    const newPortable = {
      id: devices.length + 1,
      PortableDeviceId: formData.PortableDeviceId,
      LocationName: formData.LocationName,
    };

    setDevices([...devices, newPortable]);
    handleCloseModal("modal_register");
  };

  // 🔴 DELETE
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert("Pilih user yang ingin dihapus terlebih dahulu!");
      return;
    }
    const deletePortable = devices.filter(
      (device) => !selectedIds.includes(device.id)
    );
    setDevices(deletePortable);
    setSelectedIds([]);
    handleCloseModal("modal_delete");
  };

  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100 ">
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <tr className="hover:bg-gray-50 text-center">
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-neutral"
                        // checked={selectedIds.includes(item.id)}
                        // onChange={() => handleSelectUser(item.id)}
                      />
                    </td>
                    <td>{item.UserId}</td>
                    <td>{item.UserName}</td>
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
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectUser(item.id)}
                    />
                  </td>
                  <td>{item.PortableDeviceId}</td>
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

          <div className="pt-5 flex gap-3 justify-end">
            <CustomButton
              text="Add Location"
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
              confirmText="Register"
              onSubmit={handleRegister}
            >
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Portable Device Id"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                  value={formData.PortableDeviceId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      PortableDeviceId: e.target.value,
                    })
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
              title="Delete"
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
    </div>
  );
}
